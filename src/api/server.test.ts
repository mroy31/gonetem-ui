import { describe, it, expect, vi, beforeEach } from "vitest";
import { handlePullImages } from "./server";
import { IPC_EVENT, streaming, makeStream, expectOk, expectErr } from "./testfakes";

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

describe("handlePullImages", () => {
  beforeEach(() => {
    mocks.client.current = null;
    mocks.win.webContents.send.mockClear();
  });

  it("resolves on status event and forwards progress to the window", async () => {
    const emitter = makeStream();
    mocks.client.current = { serverPullImages: streaming(emitter) };

    const pending = handlePullImages(IPC_EVENT);
    emitter.emit("data", { toObject: () => ({ progress: "docker:latest" }) });
    emitter.emit("status");

    expectOk(await pending);
    expect(mocks.win.webContents.send).toHaveBeenCalledWith("server:pull:event", {
      progress: "docker:latest",
    });
  });

  it("maps a stream error", async () => {
    const emitter = makeStream();
    mocks.client.current = { serverPullImages: streaming(emitter) };

    const pending = handlePullImages(IPC_EVENT);
    emitter.emit("error", new Error("registry unreachable"));

    const err = expectErr(await pending);
    expect(err.error).toContain("registry unreachable");
  });

  it("fails fast when not connected", async () => {
    const err = expectErr(await handlePullImages(IPC_EVENT));
    expect(err.error).toBe("Not connected to the server");
  });
});
