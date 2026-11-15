import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import ProjectContextPanel from "./ProjectContextPanel";
import { IProjectState } from "../api/interface";

const mocks = vi.hoisted(() => ({
  features: {
    topologyWrite: true,
    topologyValidation: true,
    nodeConfigRead: true,
    optionsWrite: true,
  } as Record<string, boolean>,
}));

vi.mock("../edition", () => ({
  get features() {
    return mocks.features;
  },
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

vi.mock("./TopologyEditorPanel", async () => {
  const React = await import("react");
  return { default: () => React.createElement("div", { "data-testid": "topo-panel" }) };
});
vi.mock("./ConfigurationViewerPanel", async () => {
  const React = await import("react");
  return { default: () => React.createElement("div", { "data-testid": "config-panel" }) };
});
vi.mock("./ConsolePanel", async () => {
  const React = await import("react");
  return { default: () => React.createElement("div", { "data-testid": "console-panel" }) };
});

const PRJ_STATE = {
  id: "p1",
  name: "lab",
  openAt: "2026-01-01",
  running: false,
  nodes: [],
} as IProjectState;

const setFeatures = (on: boolean) => {
  for (const key of Object.keys(mocks.features)) mocks.features[key] = on;
};

afterEach(cleanup);

describe("project context panel tabs per edition", () => {
  it("full edition shows Configuration, Topology and Console tabs", () => {
    setFeatures(true);
    render(
      <ProjectContextPanel prjStatus={PRJ_STATE} topology="" dispatch={() => {}} />
    );

    expect(screen.getByText("Configuration")).toBeTruthy();
    expect(screen.getByText("Topology")).toBeTruthy();
    expect(screen.getByText("Console")).toBeTruthy();
    expect(screen.getByTestId("config-panel")).toBeTruthy();
  });

  it("student edition shows only the Console tab", () => {
    setFeatures(false);
    render(
      <ProjectContextPanel prjStatus={PRJ_STATE} topology="" dispatch={() => {}} />
    );

    expect(screen.queryByText("Configuration")).toBeNull();
    expect(screen.queryByText("Topology")).toBeNull();
    expect(screen.getByText("Console")).toBeTruthy();
    expect(screen.getByTestId("console-panel")).toBeTruthy();
  });
});
