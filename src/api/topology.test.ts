import { describe, it, expect, vi, beforeEach } from "vitest";
import { tmpdir } from "os";
import { join } from "path";
import { mkdtemp, readFile } from "fs/promises";
import { dialog } from "electron";
import { WNetworkRequest } from "../proto/netem_pb";
import {
  handleReadTopologyFile,
  handleWriteTopologyFile,
  handleCheckTopologyFile,
  handleRunTopology,
  handleRecordTopologyImg,
} from "./topology";
import {
  IPC_EVENT,
  unary,
  resWith,
  okStatus,
  errorStatus,
  streaming,
  makeStream,
  expectOk,
  expectErr,
} from "./testfakes";

const mocks = vi.hoisted(() => ({
  client: { current: null as unknown },
  win: { webContents: { send: vi.fn() } },
}));

vi.mock("./client", () => ({
  get CLIENT() {
    return mocks.client.current;
  },
}));

vi.mock("..", () => ({
  get mainWindow() {
    return mocks.win;
  },
}));

vi.mock("electron", () => ({
  dialog: { showSaveDialog: vi.fn() },
}));

const b64 = (s: string) => Buffer.from(s).toString("base64");

describe("handleReadTopologyFile", () => {
  beforeEach(() => {
    mocks.client.current = null;
  });

  it("returns decoded topology file on success", async () => {
    mocks.client.current = {
      readNetworkFile: unary({
        res: resWith(okStatus(), { getData_asB64: () => b64("nodes:\nlinks:\n") }),
      }),
    };

    const ok = expectOk(await handleReadTopologyFile(IPC_EVENT, "prj1"));
    expect(ok.result).toBe("nodes:\nlinks:\n");
  });

  it("maps a server-reported error status", async () => {
    mocks.client.current = {
      readNetworkFile: unary({ res: resWith(errorStatus("project unknown")) }),
    };

    const err = expectErr(await handleReadTopologyFile(IPC_EVENT, "prj1"));
    expect(err.error).toContain("prj1");
    expect(err.error).toContain("project unknown");
  });

  it("maps a transport error", async () => {
    mocks.client.current = {
      readNetworkFile: unary({ err: new Error("ECONNREFUSED") }),
    };

    const err = expectErr(await handleReadTopologyFile(IPC_EVENT, "prj1"));
    expect(err.error).toContain("ECONNREFUSED");
  });

  it("reports malformed response without status", async () => {
    mocks.client.current = {
      readNetworkFile: unary({ res: resWith(undefined) }),
    };

    const err = expectErr(await handleReadTopologyFile(IPC_EVENT, "prj1"));
    expect(err.error).toContain("Malformed server response");
  });

  it("fails fast when not connected", async () => {
    const err = expectErr(await handleReadTopologyFile(IPC_EVENT, "prj1"));
    expect(err.error).toBe("Not connected to the server");
  });
});

describe("handleWriteTopologyFile", () => {
  beforeEach(() => {
    mocks.client.current = null;
  });

  it("sends base64 payload and project id", async () => {
    let captured: WNetworkRequest | null = null;
    mocks.client.current = {
      writeNetworkFile: (
        req: WNetworkRequest,
        cb: (err: Error | null, res: unknown) => void
      ) => {
        captured = req;
        cb(null, resWith(okStatus()));
      },
    };

    expectOk(await handleWriteTopologyFile(IPC_EVENT, "prj1", "nodes:\n"));
    expect(captured).not.toBeNull();
    expect(captured!.getId()).toBe("prj1");
    expect(captured!.getData()).toBe(b64("nodes:\n"));
  });

  it("maps a transport error", async () => {
    mocks.client.current = {
      writeNetworkFile: unary({ err: new Error("unreachable") }),
    };

    const err = expectErr(await handleWriteTopologyFile(IPC_EVENT, "prj1", "x"));
    expect(err.error).toContain("unreachable");
  });

  it("fails fast when not connected", async () => {
    const err = expectErr(await handleWriteTopologyFile(IPC_EVENT, "prj1", "x"));
    expect(err.error).toBe("Not connected to the server");
  });
});

describe("handleCheckTopologyFile", () => {
  beforeEach(() => {
    mocks.client.current = null;
  });

  it("succeeds when server status is OK", async () => {
    mocks.client.current = {
      topologyCheck: unary({ res: resWith(okStatus()) }),
    };

    expectOk(await handleCheckTopologyFile(IPC_EVENT, "prj1"));
  });

  it("surfaces the server error text", async () => {
    mocks.client.current = {
      topologyCheck: unary({ res: resWith(errorStatus("bad link")) }),
    };

    const err = expectErr(await handleCheckTopologyFile(IPC_EVENT, "prj1"));
    expect(err.error).toBe("bad link");
  });
});

describe("handleRunTopology", () => {
  beforeEach(() => {
    mocks.client.current = null;
    mocks.win.webContents.send.mockClear();
  });

  it("resolves on status event and forwards data events to the window", async () => {
    const emitter = makeStream();
    mocks.client.current = { topologyRun: streaming(emitter) };

    const pending = handleRunTopology(IPC_EVENT, "prj1");
    emitter.emit("data", { toObject: () => ({ msg: "running" }) });
    emitter.emit("status");

    expectOk(await pending);
    expect(mocks.win.webContents.send).toHaveBeenCalledWith("topology:run:event", {
      msg: "running",
    });
  });

  it("maps a stream error", async () => {
    const emitter = makeStream();
    mocks.client.current = { topologyRun: streaming(emitter) };

    const pending = handleRunTopology(IPC_EVENT, "prj1");
    emitter.emit("error", new Error("topology refused"));

    const err = expectErr(await pending);
    expect(err.error).toContain("topology refused");
  });

  it("fails fast when not connected", async () => {
    const err = expectErr(await handleRunTopology(IPC_EVENT, "prj1"));
    expect(err.error).toBe("Not connected to the server");
  });
});

describe("handleRecordTopologyImg", () => {
  it("writes the image when a path is chosen", async () => {
    const dir = await mkdtemp(join(tmpdir(), "gnt-"));
    const file = join(dir, "topology.png");
    vi.mocked(dialog.showSaveDialog).mockResolvedValueOnce({
      canceled: false,
      filePath: file,
    } as Awaited<ReturnType<typeof dialog.showSaveDialog>>);

    expectOk(await handleRecordTopologyImg(IPC_EVENT, Buffer.from("PNGDATA")));
    expect((await readFile(file)).toString()).toBe("PNGDATA");
  });

  it("reports cancellation", async () => {
    vi.mocked(dialog.showSaveDialog).mockResolvedValueOnce({
      canceled: true,
    } as Awaited<ReturnType<typeof dialog.showSaveDialog>>);

    const err = expectErr(await handleRecordTopologyImg(IPC_EVENT, Buffer.from("x")));
    expect(err.error).toBe("Save dialog canceled");
  });
});
