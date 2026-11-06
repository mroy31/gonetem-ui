import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import ProjectPanel from "./ProjectPanel";

vi.mock("vis-network", () => ({
  Network: class {
    on() {}
  },
}));

vi.mock("./ProjectGraph", async () => {
  const React = await import("react");
  return {
    default: () => React.createElement("div", { "data-testid": "graph" }),
  };
});

vi.mock("./ProjectContextPanel", async () => {
  const React = await import("react");
  return {
    default: () => React.createElement("div", { "data-testid": "context" }),
  };
});

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const PROJECT_STATE = {
  id: "p1",
  name: "lab",
  openAt: "2026-01-01",
  running: false,
  nodes: [
    { name: "r1", running: false, interfaces: [] },
  ],
};

Object.defineProperty(window, "api", {
  value: {
    getProjectState: async () => ({ status: true, result: PROJECT_STATE }),
    readTopologyFile: async () => ({ status: true, result: "nodes:\nlinks:\n" }),
  },
  configurable: true,
});

afterEach(cleanup);

describe("project panel", () => {
  it("renders the toolbar and graph after loading the project", async () => {
    render(<ProjectPanel prjId="p1" onClose={() => {}} />);

    await vi.waitFor(() => {
      expect(screen.getByTestId("graph")).toBeTruthy();
    });
    expect(screen.getByText("Run")).toBeTruthy();
    expect(screen.getAllByText("Save").length).toBeGreaterThan(0);
    expect(screen.getByText("Close")).toBeTruthy();
    expect(screen.getByTestId("context")).toBeTruthy();
  });

  it("surfaces a failed project load as an alert", async () => {
    Object.defineProperty(window, "api", {
      value: {
        getProjectState: async () => ({ status: false, error: "prj vanished" }),
        readTopologyFile: async () => ({ status: true, result: "" }),
      },
      configurable: true,
    });

    render(<ProjectPanel prjId="gone" onClose={() => {}} />);

    await vi.waitFor(() => {
      expect(screen.getByText("prj vanished")).toBeTruthy();
    });
  });
});
