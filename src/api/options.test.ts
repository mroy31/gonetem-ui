import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  values: new Map<string, unknown>(),
  configs: [] as { schema?: Record<string, unknown>; defaults?: Record<string, unknown> }[],
}));

vi.mock("electron-store", () => ({
  default: class FakeStore {
    private readonly defaults: Record<string, unknown>;
    constructor(config?: { schema?: Record<string, unknown>; defaults?: Record<string, unknown> }) {
      this.defaults = config?.defaults ?? {};
      mocks.configs.push(config ?? {});
    }
    get(key: string): unknown {
      return mocks.values.get(key) ?? this.defaults[key];
    }
    set(key: string, value: unknown): void {
      mocks.values.set(key, value);
    }
  },
}));

import {
  getAppState,
  setLastProjectDir,
  setLastImageExportDir,
} from "./options";

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
