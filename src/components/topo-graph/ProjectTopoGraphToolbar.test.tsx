import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import ProjectGraphToolbar from "./ProjectTopoGraphToolbar";

const mocks = vi.hoisted(() => ({
  features: {
    topologyWrite: true,
    topologyValidation: true,
    nodeConfigRead: true,
    optionsWrite: true,
  } as Record<string, boolean>,
}));

vi.mock("../../edition", () => ({
  get features() {
    return mocks.features;
  },
}));

vi.mock("react-i18next", () => ({
  useTranslation: () => ({ t: (key: string) => key }),
}));

const renderToolbar = () =>
  render(
    <ProjectGraphToolbar
      selectedEdge=""
      dwImgHandle={() => {}}
      fitHandle={() => {}}
      layoutHandle={() => {}}
      saveTopologyHandle={() => {}}
    />,
  );

const setTopologyWrite = (on: boolean) => {
  mocks.features.topologyWrite = on;
};

afterEach(() => {
  cleanup();
  setTopologyWrite(true);
});

describe("project graph toolbar per edition", () => {
  it("full edition keeps Save alongside Fit, Image and Layout", () => {
    setTopologyWrite(true);
    renderToolbar();

    expect(screen.getByText("Save")).toBeTruthy();
    expect(screen.getByText("Fit")).toBeTruthy();
    expect(screen.getByText("Image")).toBeTruthy();
    expect(screen.getByText("Layout")).toBeTruthy();
  });

  it("student edition drops Save but keeps Fit, Image and Layout", () => {
    setTopologyWrite(false);
    renderToolbar();

    expect(screen.queryByText("Save")).toBeNull();
    expect(screen.getByText("Fit")).toBeTruthy();
    expect(screen.getByText("Image")).toBeTruthy();
    expect(screen.getByText("Layout")).toBeTruthy();
  });
});
