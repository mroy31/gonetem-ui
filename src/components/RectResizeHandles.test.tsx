import React from "react";
import { describe, it, expect, afterEach } from "vitest";
import { render, cleanup } from "@testing-library/react";
import cytoscape from "cytoscape";
import RectResizeHandles from "./RectResizeHandles";
import { MIN_RECT_SIZE } from "./topologyRects";

const HANDLE_PX = 10;

let container: HTMLDivElement | null = null;

afterEach(() => {
  cleanup();
  container?.remove();
  container = null;
});

const makeGraph = () => {
  container = document.createElement("div");
  document.body.appendChild(container);
  const cy = cytoscape({
    headless: true,
    elements: [
      {
        group: "nodes",
        data: { id: "rect-0", w: 200, h: 120 },
        position: { x: 100, y: 100 },
        classes: "rect",
      },
    ],
    layout: { name: "preset" },
  });
  // a container-less instance starts with degenerate viewport values; the app
  // always has a container. Normalize so screen coords equal model coords.
  cy.pan({ x: 0, y: 0 });
  cy.zoom(1);
  return cy;
};

const mount = (cy: cytoscape.Core) =>
  render(
    <RectResizeHandles
      cy={cy}
      container={container as HTMLDivElement}
      rectId="rect-0"
    />,
  );

const handle = (get: (k: string) => HTMLElement, corner: string) =>
  get(`rect-handle-${corner}`);

const dragCorner = (el: HTMLElement, to: { x: number; y: number }) => {
  el.dispatchEvent(
    new Event("pointerdown", { bubbles: true, cancelable: true }),
  );
  window.dispatchEvent(
    new MouseEvent("pointermove", { clientX: to.x, clientY: to.y }),
  );
  window.dispatchEvent(new Event("pointerup"));
};

describe("resize handles render", () => {
  it("shows four corner handles at the rendered corners of the rect", () => {
    const cy = makeGraph();
    const { getByTestId } = mount(cy);
    const half = HANDLE_PX / 2;

    // corners: nw (0,40) ne (200,40) sw (0,160) se (200,160) at zoom 1, pan 0
    expect(handle(getByTestId, "nw").style.left).toBe(`${0 - half}px`);
    expect(handle(getByTestId, "nw").style.top).toBe(`${40 - half}px`);
    expect(handle(getByTestId, "ne").style.left).toBe(`${200 - half}px`);
    expect(handle(getByTestId, "sw").style.top).toBe(`${160 - half}px`);
    expect(handle(getByTestId, "se").style.left).toBe(`${200 - half}px`);
    expect(handle(getByTestId, "se").style.top).toBe(`${160 - half}px`);
    cy.destroy();
  });

  it("resyncs handle positions when the view is zoomed or panned", () => {
    const cy = makeGraph();
    const { getByTestId } = mount(cy);
    const half = HANDLE_PX / 2;

    cy.zoom(2);
    expect(handle(getByTestId, "ne").style.left).toBe(`${200 * 2 - half}px`);
    expect(handle(getByTestId, "ne").style.top).toBe(`${40 * 2 - half}px`);

    cy.pan({ x: 10, y: 20 });
    expect(handle(getByTestId, "nw").style.left).toBe(`${0 * 2 + 10 - half}px`);
    expect(handle(getByTestId, "nw").style.top).toBe(`${40 * 2 + 20 - half}px`);
    cy.destroy();
  });

  it("resyncs handle positions while the rect is moved", () => {
    const cy = makeGraph();
    const { getByTestId } = mount(cy);
    const half = HANDLE_PX / 2;

    cy.getElementById("rect-0").position({ x: 150, y: 100 });
    expect(handle(getByTestId, "se").style.left).toBe(`${250 - half}px`);
    expect(handle(getByTestId, "se").style.top).toBe(`${160 - half}px`);
    cy.destroy();
  });
});

describe("corner drag resize", () => {
  it("resizes with the opposite corner pinned", () => {
    const cy = makeGraph();
    const { getByTestId } = mount(cy);
    const node = cy.getElementById("rect-0");

    // se corner starts at (200,160); pin is nw corner (0,40).
    dragCorner(handle(getByTestId, "se"), { x: 300, y: 260 });

    expect(node.data("w")).toBe(300);
    expect(node.data("h")).toBe(220);
    expect(node.position()).toEqual({ x: 150, y: 150 });
    // the pinned nw corner stayed put
    const p = node.position();
    const w = Number(node.data("w"));
    const h = Number(node.data("h"));
    expect({ x: p.x - w / 2, y: p.y - h / 2 }).toEqual({ x: 0, y: 40 });
    cy.destroy();
  });

  it("resizes from the nw corner pinning the se corner", () => {
    const cy = makeGraph();
    const { getByTestId } = mount(cy);
    const node = cy.getElementById("rect-0");

    // nw corner starts at (0,40); pin is se corner (200,160).
    dragCorner(handle(getByTestId, "nw"), { x: 50, y: 100 });

    expect(node.data("w")).toBe(150);
    expect(node.data("h")).toBe(60);
    const p = node.position();
    const w = Number(node.data("w"));
    const h = Number(node.data("h"));
    expect({ x: p.x + w / 2, y: p.y + h / 2 }).toEqual({ x: 200, y: 160 });
    cy.destroy();
  });

  it("clamps at the minimum size when dragged into the pinned corner", () => {
    const cy = makeGraph();
    const { getByTestId } = mount(cy);
    const node = cy.getElementById("rect-0");

    // pin is nw (0,40); grabbing se at (10,45) asks for a 10x5 rect
    dragCorner(handle(getByTestId, "se"), { x: 10, y: 45 });

    expect(node.data("w")).toBe(MIN_RECT_SIZE.w);
    expect(node.data("h")).toBe(MIN_RECT_SIZE.h);
    cy.destroy();
  });

  it("flips to the other side of the pinned corner when dragged past it", () => {
    const cy = makeGraph();
    const { getByTestId } = mount(cy);
    const node = cy.getElementById("rect-0");

    // dragging se far past nw grows the rect left/up, never below min size
    dragCorner(handle(getByTestId, "se"), { x: -1000, y: -1000 });

    expect(node.data("w")).toBe(1000);
    expect(node.data("h")).toBe(1040);
    const p = node.position();
    expect({
      x: p.x + Number(node.data("w")) / 2,
      y: p.y + Number(node.data("h")) / 2,
    }).toEqual({ x: 0, y: 40 });
    cy.destroy();
  });

  it("moves the rect without changing its size when dragged by the body", () => {
    const cy = makeGraph();
    mount(cy);
    const node = cy.getElementById("rect-0");

    node.position({ x: 300, y: 300 });

    expect(node.position()).toEqual({ x: 300, y: 300 });
    expect(node.data("w")).toBe(200);
    expect(node.data("h")).toBe(120);
    cy.destroy();
  });
});

describe("handles stay out of the graph", () => {
  it("adds nothing to cytoscape elements and nothing inside its container", () => {
    const cy = makeGraph();
    const before = cy.elements().length;
    const { getByTestId } = mount(cy);

    expect(cy.elements().length).toBe(before);
    expect(
      container?.querySelector('[data-testid^="rect-handle-"]'),
    ).toBeNull();
    expect(getByTestId("rect-handle-se")).toBeTruthy();
    cy.destroy();
  });
});
