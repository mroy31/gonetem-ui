import React from "react";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import LabelContextMenu, { LabelContextMenuT } from "./LabelContextMenu";

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

const canvasMenu: LabelContextMenuT = {
  mode: "canvas",
  labelId: "",
  x: 10,
  y: 10,
};
const labelMenu: LabelContextMenuT = {
  mode: "label",
  labelId: "lbl-1",
  x: 10,
  y: 10,
};

const setTopologyWrite = (on: boolean) => {
  mocks.features.topologyWrite = on;
};

afterEach(() => {
  cleanup();
  setTopologyWrite(true);
});

describe("label context menu per edition", () => {
  it("full edition offers add on canvas and delete on a label", () => {
    setTopologyWrite(true);
    const { unmount } = render(
      <LabelContextMenu
        menu={canvasMenu}
        onAdd={() => {}}
        onDelete={() => {}}
      />,
    );
    expect(screen.getByText("AddLabelMenu")).toBeTruthy();
    expect(screen.queryByText("DeleteLabelMenu")).toBeNull();
    unmount();

    render(
      <LabelContextMenu
        menu={labelMenu}
        onAdd={() => {}}
        onDelete={() => {}}
      />,
    );
    expect(screen.getByText("DeleteLabelMenu")).toBeTruthy();
    expect(screen.queryByText("AddLabelMenu")).toBeNull();
  });

  it("student edition offers no add or delete entry", () => {
    setTopologyWrite(false);
    const { unmount } = render(
      <LabelContextMenu
        menu={canvasMenu}
        onAdd={() => {}}
        onDelete={() => {}}
      />,
    );
    expect(screen.queryByText("AddLabelMenu")).toBeNull();
    unmount();

    render(
      <LabelContextMenu
        menu={labelMenu}
        onAdd={() => {}}
        onDelete={() => {}}
      />,
    );
    expect(screen.queryByText("DeleteLabelMenu")).toBeNull();
  });
});
