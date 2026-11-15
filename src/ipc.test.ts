import { describe, it, expect, vi, beforeEach } from "vitest";

const mocks = vi.hoisted(() => ({
  features: {
    topologyWrite: true,
    topologyValidation: true,
    nodeConfigRead: true,
    optionsWrite: true,
  } as Record<string, boolean>,
}));

vi.mock("./edition", () => ({
  get features() {
    return mocks.features;
  },
}));

import { registerIpcHandlers, IpcHandlers } from "./ipc";

// Mirrors the channel set registered in src/index.ts.
const ALL_CHANNELS = [
  "server:isConnected",
  "server:connect",
  "client:getOptions",
  "client:setOptions",
  "server:openProject",
  "server:createProject",
  "server:saveProject",
  "server:connectProject",
  "server:listProjects",
  "server:getProjectState",
  "server:readTopology",
  "server:writeTopology",
  "server:checkTopology",
  "server:runTopology",
  "server:reloadTopology",
  "server:recordTopologyImg",
  "server:runAllConsoles",
  "server:readNodeConfigFiles",
  "server:runNodeConsole",
  "server:runNodeStart",
  "server:runNodeStop",
  "server:runNodeRestart",
  "server:runNodeCapture",
  "server:runNodeSetIfState",
  "server:close",
  "server:pullImages",
  "console:run",
  "console:write",
  "console:resize",
  "console:listOpen",
  "console:saveState",
  "i18n:read",
  "i18n:write",
];

const GATED_CHANNELS = [
  "server:writeTopology",
  "server:checkTopology",
  "server:readNodeConfigFiles",
  "client:setOptions",
];

const FULL_FEATURES = {
  topologyWrite: true,
  topologyValidation: true,
  nodeConfigRead: true,
  optionsWrite: true,
};

const STUDENT_FEATURES = {
  topologyWrite: false,
  topologyValidation: false,
  nodeConfigRead: false,
  optionsWrite: false,
};

const setFeatures = (next: Record<string, boolean>) => {
  for (const key of Object.keys(mocks.features)) delete mocks.features[key];
  Object.assign(mocks.features, next);
};

const makeRegistrar = () => {
  const registered: string[] = [];
  return {
    registered,
    handle: (channel: string) => {
      registered.push(channel);
    },
  };
};

const makeHandlers = (): IpcHandlers =>
  Object.fromEntries(ALL_CHANNELS.map((channel) => [channel, vi.fn()]));

describe("registerIpcHandlers", () => {
  beforeEach(() => {
    setFeatures(FULL_FEATURES);
  });

  it("registers every listed channel in the full edition", () => {
    const registrar = makeRegistrar();
    registerIpcHandlers(registrar, makeHandlers());

    expect(registrar.registered.sort()).toEqual([...ALL_CHANNELS].sort());
  });

  it("records exactly the four gated channels as unregistered in the student edition", () => {
    setFeatures(STUDENT_FEATURES);
    const registrar = makeRegistrar();
    registerIpcHandlers(registrar, makeHandlers());

    const expected = ALL_CHANNELS.filter((c) => !GATED_CHANNELS.includes(c));

    for (const channel of GATED_CHANNELS) {
      expect(registrar.registered).not.toContain(channel);
    }
    expect(registrar.registered.sort()).toEqual(expected.sort());
  });
});
