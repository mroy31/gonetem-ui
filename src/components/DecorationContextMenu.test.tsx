import React from "react";
import { readFileSync } from "fs";
import { join } from "path";
import { describe, it, expect, vi, afterEach } from "vitest";
import { render, screen, cleanup } from "@testing-library/react";
import DecorationContextMenu, {
  DecorationContextMenuT,
} from "./DecorationContextMenu";

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

const canvasMenu: DecorationContextMenuT = {
  mode: "canvas",
  labelId: "",
  x: 10,
  y: 10,
};
const decorationMenu: DecorationContextMenuT = {
  mode: "label",
  labelId: "lbl-1",
  x: 10,
  y: 10,
};
const rectMenu: DecorationContextMenuT = {
  mode: "rect",
  labelId: "rect-1",
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

describe("decoration context menu per edition", () => {
  it("full edition offers add on canvas and delete on a label", () => {
    setTopologyWrite(true);
    const { unmount } = render(
      <DecorationContextMenu
        menu={canvasMenu}
        onAdd={() => {}}
        onAddRect={() => {}}
        onDelete={() => {}}
      />,
    );
    expect(screen.getByText("AddLabelMenu")).toBeTruthy();
    expect(screen.getByText("AddRectMenu")).toBeTruthy();
    expect(screen.queryByText("DeleteLabelMenu")).toBeNull();
    expect(screen.queryByText("DeleteRectMenu")).toBeNull();
    unmount();

    render(
      <DecorationContextMenu
        menu={decorationMenu}
        onAdd={() => {}}
        onAddRect={() => {}}
        onDelete={() => {}}
      />,
    );
    expect(screen.getByText("DeleteLabelMenu")).toBeTruthy();
    expect(screen.queryByText("AddLabelMenu")).toBeNull();
    unmount();

    render(
      <DecorationContextMenu
        menu={rectMenu}
        onAdd={() => {}}
        onAddRect={() => {}}
        onDelete={() => {}}
      />,
    );
    expect(screen.getByText("DeleteRectMenu")).toBeTruthy();
    expect(screen.queryByText("AddRectMenu")).toBeNull();
  });

  it("student edition offers no add or delete entry", () => {
    setTopologyWrite(false);
    const { unmount } = render(
      <DecorationContextMenu
        menu={canvasMenu}
        onAdd={() => {}}
        onAddRect={() => {}}
        onDelete={() => {}}
      />,
    );
    expect(screen.queryByText("AddLabelMenu")).toBeNull();
    expect(screen.queryByText("AddRectMenu")).toBeNull();
    unmount();

    render(
      <DecorationContextMenu
        menu={decorationMenu}
        onAdd={() => {}}
        onAddRect={() => {}}
        onDelete={() => {}}
      />,
    );
    expect(screen.queryByText("DeleteLabelMenu")).toBeNull();
    unmount();

    render(
      <DecorationContextMenu
        menu={rectMenu}
        onAdd={() => {}}
        onAddRect={() => {}}
        onDelete={() => {}}
      />,
    );
    expect(screen.queryByText("DeleteRectMenu")).toBeNull();
  });
});

describe("menu translation keys", () => {
  const KEYS = [
    "AddLabelMenu",
    "DeleteLabelMenu",
    "AddRectMenu",
    "DeleteRectMenu",
  ];

  it.each(["en", "fr"])("resolves every menu key in the %s locale", (loc) => {
    const path = join(
      __dirname,
      "..",
      "..",
      "app",
      "localization",
      "locales",
      loc,
      "translation.json",
    );
    const bundle = JSON.parse(readFileSync(path, "utf-8")) as {
      [key: string]: unknown;
    };
    KEYS.forEach((key) => {
      expect(typeof bundle[key], `${loc}/${key}`).toBe("string");
      expect((bundle[key] as string).length, `${loc}/${key}`).toBeGreaterThan(
        0,
      );
    });
  });
});
