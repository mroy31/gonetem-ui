import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup, fireEvent } from "@testing-library/react";
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
  return {
    default: () => React.createElement("div", { "data-testid": "topo-panel" }),
  };
});
vi.mock("./ConfigurationViewerPanel", async () => {
  const React = await import("react");
  return {
    default: () =>
      React.createElement("div", { "data-testid": "config-panel" }),
  };
});
vi.mock("./ConsolePanel", async () => {
  const React = await import("react");
  return {
    default: () =>
      React.createElement("div", { "data-testid": "console-panel" }),
  };
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
      <ProjectContextPanel
        prjStatus={PRJ_STATE}
        topology=""
        dispatch={() => {}}
      />,
    );

    expect(screen.getByText("Configuration")).toBeTruthy();
    expect(screen.getByText("Topology")).toBeTruthy();
    expect(screen.getByText("Console")).toBeTruthy();
    expect(screen.getByTestId("config-panel")).toBeTruthy();
  });

  it("student edition shows only the Console tab", () => {
    setFeatures(false);
    render(
      <ProjectContextPanel
        prjStatus={PRJ_STATE}
        topology=""
        dispatch={() => {}}
      />,
    );

    expect(screen.queryByText("Configuration")).toBeNull();
    expect(screen.queryByText("Topology")).toBeNull();
    expect(screen.getByText("Console")).toBeTruthy();
    expect(screen.getByTestId("console-panel")).toBeTruthy();
  });
});

describe("project context panel resize", () => {
  const renderPanel = () =>
    render(
      <ProjectContextPanel
        prjStatus={PRJ_STATE}
        topology=""
        dispatch={() => {}}
      />,
    );

  const widthDiv = (container: HTMLElement) =>
    container.querySelector<HTMLElement>("div[style*='width']");

  const innerWidth = 1024;
  const MIN_PANEL_WIDTH = 250;
  const MIN_GRAPH_WIDTH = 300;

  afterEach(() => {
    vi.restoreAllMocks();
  });

  it("clamps the panel to its maximum when dragged far to the left", () => {
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(innerWidth);
    const { container } = renderPanel();
    const handle = container.querySelector(".cursor-col-resize") as HTMLElement;

    fireEvent.mouseDown(handle);
    fireEvent.mouseMove(window, { movementX: -9000 });

    const maxWidth = innerWidth - MIN_GRAPH_WIDTH;
    expect(widthDiv(container)?.style.width).toBe(`${maxWidth / 16}rem`);
  });

  it("clamps the panel to its minimum when dragged far to the right", () => {
    vi.spyOn(window, "innerWidth", "get").mockReturnValue(innerWidth);
    const { container } = renderPanel();
    const handle = container.querySelector(".cursor-col-resize") as HTMLElement;

    fireEvent.mouseDown(handle);
    fireEvent.mouseMove(window, { movementX: 9000 });

    expect(widthDiv(container)?.style.width).toBe(`${MIN_PANEL_WIDTH / 16}rem`);
  });

  it("removes the window mouse listeners on unmount", () => {
    const removeSpy = vi.spyOn(window, "removeEventListener");
    const { unmount } = renderPanel();

    unmount();

    const types = removeSpy.mock.calls.map((call) => call[0]);
    expect(types).toContain("mousemove");
    expect(types).toContain("mouseup");
    removeSpy.mockRestore();
  });
});
