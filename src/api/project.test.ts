import { describe, it, expect, vi, beforeEach } from "vitest";
import { tmpdir, homedir } from "os";
import { join } from "path";
import { mkdtemp, readFile, writeFile } from "fs/promises";
import { dialog } from "electron";
import { OpenRequest, ProjectSaveMsg } from "../proto/netem_pb";
import * as projectModule from "./project";
import {
  handleCloseProject,
  handleConnectProject,
  handleCreateProject,
  handleGetProjectState,
  handleListProjects,
  handleOpenProject,
  handleSaveProject,
} from "./project";
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
  options: { lastProjectDir: "" },
}));

vi.mock("./client", () => ({
  get CLIENT() {
    return mocks.client.current;
  },
}));

vi.mock("./options", () => ({
  getAppState: () => ({
    winBounds: { width: 1200, height: 800 },
    lastProjectDir: mocks.options.lastProjectDir,
    lastImageExportDir: "",
  }),
  setLastProjectDir: (dir: string) => {
    mocks.options.lastProjectDir = dir;
  },
}));

vi.mock("..", () => ({
  get mainWindow() {
    return mocks.win;
  },
}));

vi.mock("./console", () => ({
  closeRunningConsoles: vi.fn(),
}));

vi.mock("electron", () => ({
  dialog: { showOpenDialog: vi.fn(), showSaveDialog: vi.fn() },
}));

describe("handleListProjects", () => {
  beforeEach(() => {
    mocks.client.current = null;
  });

  it("maps the project list", async () => {
    mocks.client.current = {
      projectGetMany: unary({
        res: resWith(okStatus(), {
          getProjectsList: () => [
            {
              getName: () => "lab",
              getId: () => "p1",
              getOpenat: () => "2026-01-01",
            },
          ],
        }),
      }),
    };

    const ok = expectOk(await handleListProjects(IPC_EVENT));
    expect(ok.result).toEqual([
      { name: "lab", id: "p1", openAt: "2026-01-01" },
    ]);
  });

  it("maps a transport error", async () => {
    mocks.client.current = {
      projectGetMany: unary({ err: new Error("socket closed") }),
    };

    const err = expectErr(await handleListProjects(IPC_EVENT));
    expect(err.error).toContain("socket closed");
  });

  it("maps a server error status", async () => {
    mocks.client.current = {
      projectGetMany: unary({ res: resWith(errorStatus("forbidden")) }),
    };

    const err = expectErr(await handleListProjects(IPC_EVENT));
    expect(err.error).toContain("forbidden");
  });

  it("fails fast when not connected", async () => {
    const err = expectErr(await handleListProjects(IPC_EVENT));
    expect(err.error).toBe("Not connected to the server");
  });
});

describe("handleGetProjectState", () => {
  beforeEach(() => {
    mocks.client.current = null;
  });

  it("maps state with nodes and interfaces", async () => {
    mocks.client.current = {
      projectGetStatus: unary({
        res: resWith(okStatus(), {
          getId: () => "p1",
          getName: () => "lab",
          getOpenat: () => "now",
          getRunning: () => true,
          getNodesList: () => [
            {
              getName: () => "r1",
              getRunning: () => true,
              getInterfacesList: () => [
                { getName: () => "eth0", getState: () => 1 },
              ],
            },
          ],
        }),
      }),
    };

    const ok = expectOk(await handleGetProjectState(IPC_EVENT, "p1"));
    expect(ok.result).toEqual({
      id: "p1",
      name: "lab",
      openAt: "now",
      running: true,
      nodes: [
        {
          name: "r1",
          running: true,
          interfaces: [{ name: "eth0", state: 1 }],
        },
      ],
    });
  });

  it("fails fast when not connected", async () => {
    const err = expectErr(await handleGetProjectState(IPC_EVENT, "p1"));
    expect(err.error).toBe("Not connected to the server");
  });
});

describe("open / save / close project flow", () => {
  let dir: string;

  beforeEach(async () => {
    dir = await mkdtemp(join(tmpdir(), "gnt-prj-"));
    mocks.client.current = null;
    mocks.options.lastProjectDir = "";
    mocks.win.webContents.send.mockClear();
    await handleConnectProject(IPC_EVENT, "");
    expect(projectModule.CURRENT_PROJECT_ID).toBe("");
  });

  it("opens a .gnet file and records the opened id", async () => {
    const file = join(dir, "lab.gnet");
    await writeFile(file, "gzip-bytes");

    let captured: OpenRequest | null = null;
    mocks.client.current = {
      projectOpen: (
        req: OpenRequest,
        cb: (err: Error | null, res: unknown) => void
      ) => {
        captured = req;
        cb(null, resWith(okStatus(), { getId: () => "opened-id" }));
      },
    };
    vi.mocked(dialog.showOpenDialog).mockResolvedValueOnce({
      canceled: false,
      filePaths: [file],
    } as Awaited<ReturnType<typeof dialog.showOpenDialog>>);

    const ok = expectOk(await handleOpenProject(IPC_EVENT));
    expect(ok.result).toBe("opened-id");
    expect(captured!.getName()).toBe("lab");
    expect(projectModule.CURRENT_PROJECT_ID).toBe("opened-id");
    expect(projectModule.CURRENT_PROJECT_FILEPATH).toBe(file);

    await cleanupClose();
  });

  it("refuses a file without .gnet extension", async () => {
    const file = join(dir, "notes.txt");
    await writeFile(file, "x");
    vi.mocked(dialog.showOpenDialog).mockResolvedValueOnce({
      canceled: false,
      filePaths: [file],
    } as Awaited<ReturnType<typeof dialog.showOpenDialog>>);
    mocks.client.current = {};

    const err = expectErr(await handleOpenProject(IPC_EVENT));
    expect(err.error).toContain(".gnet");
  });

  it("refuses to open while a project is already open", async () => {
    mocks.client.current = {};
    await handleConnectProject(IPC_EVENT, "already-open");
    const err = expectErr(await handleOpenProject(IPC_EVENT));
    expect(err.error).toContain("already open");

    await handleConnectProject(IPC_EVENT, "");
  });

  it("saves project data bytes to the recorded filepath", async () => {
    const file = join(dir, "lab.gnet");
    await writeFile(file, "initial");
    mocks.client.current = {
      projectOpen: unary({
        res: resWith(okStatus(), { getId: () => "save-id" }),
      }),
    };
    vi.mocked(dialog.showOpenDialog).mockResolvedValueOnce({
      canceled: false,
      filePaths: [file],
    } as Awaited<ReturnType<typeof dialog.showOpenDialog>>);
    await handleOpenProject(IPC_EVENT);

    const emitter = makeStream();
    mocks.client.current = {
      ...(mocks.client.current as Record<string, unknown>),
      projectSave: streaming(emitter),
    };

    const pending = handleSaveProject(IPC_EVENT, "save-id");
    emitter.emit("data", {
      getCode: () => ProjectSaveMsg.Code.DATA,
      getData: () => "saved-bytes",
      toObject: () => ({}),
    });
    emitter.emit("status");

    expectOk(await pending);
    expect((await readFile(file)).toString()).toBe("saved-bytes");

    await cleanupClose();
  });

  it("refuses to save with unknown filepath", async () => {
    mocks.client.current = {};
    const err = expectErr(await handleSaveProject(IPC_EVENT, "p1"));
    expect(err.error).toContain("No filepath known");
  });

  it("creates an empty .gnet project and opens it", async () => {
    const file = join(dir, "new-prj.gnet");
    mocks.client.current = {
      projectOpen: unary({
        res: resWith(okStatus(), { getId: () => "created-id" }),
      }),
    };
    vi.mocked(dialog.showSaveDialog).mockResolvedValueOnce({
      canceled: false,
      filePath: file,
    } as Awaited<ReturnType<typeof dialog.showSaveDialog>>);

    const ok = expectOk(await handleCreateProject(IPC_EVENT));
    expect(ok.result).toBe("created-id");

    const written = await readFile(file);
    expect(written.length).toBeGreaterThan(0);

    await cleanupClose();
  });

  it("clears project state on close", async () => {
    const file = join(dir, "lab.gnet");
    await writeFile(file, "x");
    mocks.client.current = {
      projectOpen: unary({
        res: resWith(okStatus(), { getId: () => "close-id" }),
      }),
    };
    vi.mocked(dialog.showOpenDialog).mockResolvedValueOnce({
      canceled: false,
      filePaths: [file],
    } as Awaited<ReturnType<typeof dialog.showOpenDialog>>);
    await handleOpenProject(IPC_EVENT);

    await cleanupClose();
    expect(projectModule.CURRENT_PROJECT_ID).toBe("");
    expect(projectModule.CURRENT_PROJECT_FILEPATH).toBe("");
  });

  it("opens the open dialog in the stored project directory", async () => {
    mocks.client.current = {};
    mocks.options.lastProjectDir = dir;
    vi.mocked(dialog.showOpenDialog).mockResolvedValueOnce({
      canceled: true,
    } as Awaited<ReturnType<typeof dialog.showOpenDialog>>);

    await handleOpenProject(IPC_EVENT);
    const [options] = vi.mocked(dialog.showOpenDialog).mock.calls[0];
    expect(options?.defaultPath).toBe(dir);
  });

  it("falls back to the home directory when the stored directory is gone", async () => {
    mocks.client.current = {};
    mocks.options.lastProjectDir = join(dir, "unmounted");
    vi.mocked(dialog.showOpenDialog).mockResolvedValueOnce({
      canceled: true,
    } as Awaited<ReturnType<typeof dialog.showOpenDialog>>);

    await handleOpenProject(IPC_EVENT);
    const [options] = vi.mocked(dialog.showOpenDialog).mock.calls[0];
    expect(options?.defaultPath).toBe(homedir());
  });

  it("remembers the directory of a confirmed open pick", async () => {
    const file = join(dir, "lab.gnet");
    await writeFile(file, "gzip-bytes");
    mocks.client.current = {
      projectOpen: unary({
        res: resWith(okStatus(), { getId: () => "mem-id" }),
      }),
    };
    vi.mocked(dialog.showOpenDialog).mockResolvedValueOnce({
      canceled: false,
      filePaths: [file],
    } as Awaited<ReturnType<typeof dialog.showOpenDialog>>);

    expectOk(await handleOpenProject(IPC_EVENT));
    expect(mocks.options.lastProjectDir).toBe(dir);

    await cleanupClose();
  });

  it("keeps the stored directory when the open dialog is canceled", async () => {
    mocks.client.current = {};
    mocks.options.lastProjectDir = "/pristine";
    vi.mocked(dialog.showOpenDialog).mockResolvedValueOnce({
      canceled: true,
    } as Awaited<ReturnType<typeof dialog.showOpenDialog>>);

    const err = expectErr(await handleOpenProject(IPC_EVENT));
    expect(err.error).toBe("Open dialog canceled");
    expect(mocks.options.lastProjectDir).toBe("/pristine");
  });

  it("does not remember an extension-rejected open pick", async () => {
    const file = join(dir, "notes.txt");
    await writeFile(file, "x");
    mocks.client.current = {};
    mocks.options.lastProjectDir = "/pristine";
    vi.mocked(dialog.showOpenDialog).mockResolvedValueOnce({
      canceled: false,
      filePaths: [file],
    } as Awaited<ReturnType<typeof dialog.showOpenDialog>>);

    expectErr(await handleOpenProject(IPC_EVENT));
    expect(mocks.options.lastProjectDir).toBe("/pristine");
  });

  it("create dialog shares the project directory memory", async () => {
    const file = join(dir, "shared.gnet");
    mocks.client.current = {
      projectOpen: unary({
        res: resWith(okStatus(), { getId: () => "shared-id" }),
      }),
    };
    mocks.options.lastProjectDir = dir;
    vi.mocked(dialog.showSaveDialog).mockResolvedValueOnce({
      canceled: false,
      filePath: file,
    } as Awaited<ReturnType<typeof dialog.showSaveDialog>>);

    expectOk(await handleCreateProject(IPC_EVENT));
    const [options] = vi.mocked(dialog.showSaveDialog).mock.calls[0];
    expect(options?.defaultPath).toBe(dir);
    expect(mocks.options.lastProjectDir).toBe(dir);

    await cleanupClose();
  });

  it("keeps the stored directory when the create dialog is canceled", async () => {
    mocks.client.current = {};
    mocks.options.lastProjectDir = "/pristine";
    vi.mocked(dialog.showSaveDialog).mockResolvedValueOnce({
      canceled: true,
    } as Awaited<ReturnType<typeof dialog.showSaveDialog>>);

    const err = expectErr(await handleCreateProject(IPC_EVENT));
    expect(err.error).toBe("Save dialog canceled");
    expect(mocks.options.lastProjectDir).toBe("/pristine");
  });

  it("fails fast when not connected", async () => {
    const err = expectErr(await handleOpenProject(IPC_EVENT));
    expect(err.error).toBe("Not connected to the server");
  });

  async function cleanupClose() {
    const emitter = makeStream();
    mocks.client.current = {
      ...(mocks.client.current as Record<string, unknown>),
      projectClose: streaming(emitter),
    };
    const pending = handleCloseProject(IPC_EVENT, "any-id");
    emitter.emit("status");
    await pending;
  }
});
