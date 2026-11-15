import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  values: new Map<string, unknown>(),
  configs: [] as { schema?: Record<string, unknown>; defaults?: Record<string, unknown> }[],
  getCalls: [] as string[],
}));

const editionMock = vi.hoisted(() => ({
  edition: "full" as "full" | "student",
  studentServerUri: "",
}));

vi.mock("electron-store", () => ({
  default: class FakeStore {
    private readonly defaults: Record<string, unknown>;
    constructor(config?: { schema?: Record<string, unknown>; defaults?: Record<string, unknown> }) {
      this.defaults = config?.defaults ?? {};
      mocks.configs.push(config ?? {});
    }
    get(key: string): unknown {
      mocks.getCalls.push(key);
      return mocks.values.get(key) ?? this.defaults[key];
    }
    set(key: string, value: unknown): void {
      mocks.values.set(key, value);
    }
  },
}));

vi.mock("../edition", () => ({
  get edition() {
    return editionMock.edition;
  },
  get studentServerUri() {
    return editionMock.studentServerUri;
  },
}));

import {
  getAppState,
  setLastProjectDir,
  setLastImageExportDir,
  getOptions,
  handleGetOptions,
  DEFAULT_CONSOLE_CMD,
} from "./options";

const EVENT = undefined as never;

describe("last dialog directories app state", () => {
  beforeEach(() => {
    mocks.values.clear();
  });

  it("registers string keys with empty-string defaults", () => {
    const config = mocks.configs[0];
    expect(config.schema?.lastProjectDir).toEqual({ type: "string" });
    expect(config.schema?.lastImageExportDir).toEqual({ type: "string" });
    expect(config.defaults?.lastProjectDir).toBe("");
    expect(config.defaults?.lastImageExportDir).toBe("");
  });

  it("exposes the last project directory through the app state", () => {
    expect(getAppState().lastProjectDir).toBe("");
    setLastProjectDir("/tmp/prj");
    expect(getAppState().lastProjectDir).toBe("/tmp/prj");
  });

  it("exposes the last image export directory through the app state", () => {
    expect(getAppState().lastImageExportDir).toBe("");
    setLastImageExportDir("/tmp/img");
    expect(getAppState().lastImageExportDir).toBe("/tmp/img");
  });

  it("keeps the two directory memories independent", () => {
    setLastProjectDir("/tmp/prj");
    expect(getAppState().lastImageExportDir).toBe("");
    setLastImageExportDir("/tmp/img");
    expect(getAppState().lastProjectDir).toBe("/tmp/prj");
  });
});

describe("getOptions per edition", () => {
  beforeEach(() => {
    mocks.values.clear();
    mocks.getCalls.length = 0;
    editionMock.edition = "full";
    editionMock.studentServerUri = "";
  });

  it("student edition returns baked values without consulting the store", async () => {
    editionMock.edition = "student";
    editionMock.studentServerUri = "tcp://teacher:10110";

    const res = await handleGetOptions(EVENT);

    expect(res).toEqual({
      status: true,
      result: {
        server: "tcp://teacher:10110",
        autoconnect: true,
        tls: { enabled: false },
        consoleExternalCmd: DEFAULT_CONSOLE_CMD,
      },
    });
    expect(mocks.getCalls).toEqual([]);
  });

  it("full edition reads the stored (default) options", () => {
    expect(getOptions()).toEqual({
      server: "",
      autoconnect: true,
      tls: { enabled: false },
      consoleExternalCmd: DEFAULT_CONSOLE_CMD,
    });
    expect(mocks.getCalls).toEqual(
      expect.arrayContaining(["server", "autoconnect", "tls", "consoleExternalCmd"])
    );
  });
});
