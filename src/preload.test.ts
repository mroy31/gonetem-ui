import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  features: {
    topologyWrite: true,
    topologyValidation: true,
    nodeConfigRead: true,
    optionsWrite: true,
  } as Record<string, boolean>,
  invoke: vi.fn(),
}));

vi.mock("electron", () => ({
  contextBridge: {
    exposeInMainWorld: () => {},
  },
  ipcRenderer: {
    invoke: (...args: unknown[]) => mocks.invoke(...args),
    on: () => {},
    removeAllListeners: () => {},
  },
}));

vi.mock("./edition", () => ({
  get features() {
    return mocks.features;
  },
}));

import { buildExposedApi } from "./preload";

const GATED_KEYS = [
  "setOptions",
  "writeTopologyFile",
  "checkTopologyFile",
  "readNodeConfigFiles",
];

const NON_GATED_KEYS = [
  "isConnected",
  "connect",
  "getOptions",
  "openProject",
  "createProject",
  "saveProject",
  "connectProject",
  "listProjects",
  "getProjectState",
  "readTopologyFile",
  "runTopology",
  "reloadTopology",
  "recordTopologyImg",
  "runAllConsoles",
  "runNodeConsole",
  "runNodeStart",
  "runNodeStop",
  "runNodeRestart",
  "runNodeCapture",
  "runNodeSetIfState",
  "closeProject",
  "pullImages",
  "serverPullAddListener",
  "serverPullRemoveAllListeners",
  "topologyRunAddListener",
  "topologyRunRemoveAllListeners",
  "projectSaveAddListener",
  "projectSaveRemoveAllListeners",
  "projectCloseAddListener",
  "projectCloseRemoveAllListeners",
  "consoleRun",
  "consoleWrite",
  "consoleResize",
  "consoleSaveState",
  "consoleListOpen",
  "consoleAddListener",
  "consoleRemoveListeners",
  "i18nRead",
  "i18nCreate",
];

const setFeatures = (on: boolean) => {
  for (const key of Object.keys(mocks.features)) mocks.features[key] = on;
};

const has = (api: object, key: string) =>
  Object.prototype.hasOwnProperty.call(api, key);

describe("preload exposed api", () => {
  beforeEach(() => {
    setFeatures(true);
  });

  it("exposes every method in the full edition", () => {
    const api = buildExposedApi();
    for (const key of [...GATED_KEYS, ...NON_GATED_KEYS]) {
      expect(has(api, key)).toBe(true);
    }
  });

  it("omits exactly the gated methods in the student edition", () => {
    setFeatures(false);
    const api = buildExposedApi();

    for (const key of GATED_KEYS) {
      expect(has(api, key)).toBe(false);
    }
    for (const key of NON_GATED_KEYS) {
      expect(has(api, key)).toBe(true);
    }
  });
});
