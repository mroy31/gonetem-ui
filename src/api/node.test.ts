import { describe, it, expect, vi, beforeEach } from "vitest";
import {
  ConfigFilesResponse,
  ExecOnceResponse,
  IfState,
  NodeExecOnceRequest,
  NodeIfStateRequest,
  Status,
  StatusCode,
} from "../proto/netem_pb";
import {
  handleNodeCapture,
  handleNodeExecOnce,
  handleNodeRestart,
  handleNodeSetIfState,
  handleNodeStart,
  handleNodeStop,
  handleReadNodeConfigFiles,
} from "./node";
import {
  IPC_EVENT,
  unary,
  resWith,
  okStatus,
  errorStatus,
  expectOk,
  expectErr,
} from "./testfakes";

const mocks = vi.hoisted(() => ({
  client: { current: null as unknown },
}));

vi.mock("./client", () => ({
  get CLIENT() {
    return mocks.client.current;
  },
}));

vi.mock("./options", () => ({
  getOptions: () => ({ consoleExternalCmd: "/usr/bin/false" }),
}));

const b64 = (s: string) => Buffer.from(s).toString("base64");

describe("handleReadNodeConfigFiles", () => {
  beforeEach(() => {
    mocks.client.current = null;
  });

  it("decodes config files and reports the running source", async () => {
    mocks.client.current = {
      nodeReadConfigFiles: unary({
        res: resWith(okStatus(), {
          getSource: () => ConfigFilesResponse.Source.RUNNING,
          getFilesList: () => [
            { getName: () => "interfaces", getData_asB64: () => b64("iface-data") },
          ],
        }),
      }),
    };

    const ok = expectOk(await handleReadNodeConfigFiles(IPC_EVENT, "prj1", "r1"));
    expect(ok.result).toEqual({
      running: true,
      files: [{ name: "interfaces", data: "iface-data" }],
    });
  });

  it("maps a server error status", async () => {
    mocks.client.current = {
      nodeReadConfigFiles: unary({ res: resWith(errorStatus("no such node")) }),
    };

    const err = expectErr(await handleReadNodeConfigFiles(IPC_EVENT, "prj1", "r1"));
    expect(err.error).toContain("prj1.r1");
    expect(err.error).toContain("no such node");
  });

  it("maps a transport error", async () => {
    mocks.client.current = {
      nodeReadConfigFiles: unary({ err: new Error("reset by peer") }),
    };

    const err = expectErr(await handleReadNodeConfigFiles(IPC_EVENT, "prj1", "r1"));
    expect(err.error).toContain("reset by peer");
  });

  it("fails fast when not connected", async () => {
    const err = expectErr(await handleReadNodeConfigFiles(IPC_EVENT, "prj1", "r1"));
    expect(err.error).toBe("Not connected to the server");
  });
});

// Round-trips through the wire format so bytes fields come back exactly as
// the grpc layer yields them (a Uint8Array in google-protobuf 3.21+):
// decoding them with String(Uint8Array) would return comma-separated byte
// values instead of the text.
const wireExecRes = (stdout: string, exitCode = 0, stderr = "") => {
  const res = new ExecOnceResponse();
  const status = new Status();
  status.setCode(StatusCode.OK);
  res.setStatus(status);
  res.setExitcode(exitCode);
  res.setStdout(Buffer.from(stdout, "utf8"));
  res.setStderr(Buffer.from(stderr, "utf8"));
  return ExecOnceResponse.deserializeBinary(res.serializeBinary());
};

describe("handleNodeExecOnce", () => {
  beforeEach(() => {
    mocks.client.current = null;
  });

  it("decodes stdout as utf-8 text", async () => {
    let captured: NodeExecOnceRequest | null = null;
    mocks.client.current = {
      nodeExecOnce: (req: NodeExecOnceRequest, cb: (e: Error | null, r: unknown) => void) => {
        captured = req;
        cb(null, wireExecRes(`{"routerId":"1.1.1.1"}\n`));
      },
    };

    const ok = expectOk(
      await handleNodeExecOnce(IPC_EVENT, "prj1", "r1", ["vtysh", "-c", "show ip ospf database router json"])
    );
    expect(JSON.parse(ok.result)).toEqual({ routerId: "1.1.1.1" });
    expect(captured!.getPrjid()).toBe("prj1");
    expect(captured!.getNode()).toBe("r1");
    expect(captured!.getCmdList()).toEqual(["vtysh", "-c", "show ip ospf database router json"]);
  });

  it("decodes stderr as utf-8 text on a non-zero exit code", async () => {
    mocks.client.current = {
      nodeExecOnce: (_req: unknown, cb: (e: Error | null, r: unknown) => void) =>
        cb(null, wireExecRes("", 1, "% Command invalid at this level.")),
    };

    const err = expectErr(await handleNodeExecOnce(IPC_EVENT, "prj1", "r1", ["vtysh"]));
    expect(err.error).toContain("cmd returns code 1");
    expect(err.error).toContain("% Command invalid at this level.");
  });

  it("maps a transport error", async () => {
    mocks.client.current = {
      nodeExecOnce: unary({ err: new Error("reset by peer") }),
    };

    const err = expectErr(await handleNodeExecOnce(IPC_EVENT, "prj1", "r1", ["vtysh"]));
    expect(err.error).toContain("reset by peer");
  });

  it("fails fast when not connected", async () => {
    const err = expectErr(await handleNodeExecOnce(IPC_EVENT, "prj1", "r1", ["vtysh"]));
    expect(err.error).toBe("Not connected to the server");
  });
});

describe("node lifecycle handlers", () => {
  beforeEach(() => {
    mocks.client.current = null;
  });

  it("starts a node on OK status", async () => {
    mocks.client.current = {
      nodeStart: unary({ res: resWith(okStatus()) }),
    };

    expectOk(await handleNodeStart(IPC_EVENT, "prj1", "r1"));
  });

  it("maps a server error on stop", async () => {
    mocks.client.current = {
      nodeStop: unary({ res: resWith(errorStatus("device busy")) }),
    };

    const err = expectErr(await handleNodeStop(IPC_EVENT, "prj1", "r1"));
    expect(err.error).toContain("device busy");
  });

  it("maps a transport error on restart", async () => {
    mocks.client.current = {
      nodeRestart: unary({ err: new Error("deadline exceeded") }),
    };

    const err = expectErr(await handleNodeRestart(IPC_EVENT, "prj1", "r1"));
    expect(err.error).toContain("deadline exceeded");
  });

  it("sets interface state with the requested values", async () => {
    let captured: NodeIfStateRequest | null = null;
    mocks.client.current = {
      nodeSetIfState: (
        req: NodeIfStateRequest,
        cb: (err: Error | null, res: unknown) => void
      ) => {
        captured = req;
        cb(null, resWith(okStatus()));
      },
    };

    expectOk(await handleNodeSetIfState(IPC_EVENT, "prj1", "r1", 2, true));
    expect(captured!.getPrjid()).toBe("prj1");
    expect(captured!.getNode()).toBe("r1");
    expect(captured!.getIfindex()).toBe(2);
    expect(captured!.getState()).toBe(IfState.UP);
  });

  it("fails fast when not connected", async () => {
    const err = expectErr(await handleNodeStart(IPC_EVENT, "prj1", "r1"));
    expect(err.error).toBe("Not connected to the server");
  });

  it("fails fast on capture when not connected", async () => {
    const err = expectErr(await handleNodeCapture(IPC_EVENT, "prj1", "r1", 0));
    expect(err.error).toBe("Not connected to the server");
  });
});
