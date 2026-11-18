import { describe, it, expect } from "vitest";
import cytoscape from "cytoscape";
import {
  parseTopologyRects,
  nextRectId,
  serializeRects,
  createRect,
  mergeRectsIntoTopology,
  DEFAULT_RECT_SIZE,
  MIN_RECT_SIZE,
} from "./topologyRects";

describe("parseTopologyRects", () => {
  it("parses valid rects from the top-level ui section", () => {
    expect(
      parseTopologyRects({
        nodes: { r1: {}, h1: null },
        ui: {
          rects: {
            "rect-0": { position: { x: 10, y: 20 }, w: 200, h: 120 },
            "rect-1": { position: { x: 0, y: 0 }, w: 41, h: 31 },
          },
        },
      })
    ).toEqual({
      "rect-0": { position: { x: 10, y: 20 }, w: 200, h: 120 },
      "rect-1": { position: { x: 0, y: 0 }, w: 41, h: 31 },
    });
  });

  it("returns an empty map when the ui section is absent or malformed", () => {
    expect(parseTopologyRects({ nodes: { r1: {} } })).toEqual({});
    expect(parseTopologyRects(null)).toEqual({});
    expect(parseTopologyRects(undefined)).toEqual({});
    expect(parseTopologyRects("topo")).toEqual({});
    expect(parseTopologyRects({ ui: "rects:" })).toEqual({});
    expect(parseTopologyRects({ ui: ["rects"] })).toEqual({});
    expect(parseTopologyRects({ ui: { rects: [] } })).toEqual({});
    expect(parseTopologyRects({ ui: { rects: null } })).toEqual({});
  });

  it("skips entries with malformed shapes", () => {
    expect(
      parseTopologyRects({
        ui: {
          rects: {
            ok: { position: { x: 1, y: 2 }, w: 50, h: 40 },
            notObj: "just text",
            nullEntry: null,
            noPosition: { w: 50, h: 40 },
            badPosition: { position: { x: "10", y: 2 }, w: 50, h: 40 },
            nanPosition: { position: { x: NaN, y: 2 }, w: 50, h: 40 },
            noW: { position: { x: 1, y: 2 }, h: 40 },
            badW: { position: { x: 1, y: 2 }, w: "50", h: 40 },
            zeroW: { position: { x: 1, y: 2 }, w: 0, h: 40 },
            negativeH: { position: { x: 1, y: 2 }, w: 50, h: -3 },
            noH: { position: { x: 1, y: 2 }, w: 50 },
          },
        },
      })
    ).toEqual({ ok: { position: { x: 1, y: 2 }, w: 50, h: 40 } });
  });

  it("skips rect keys that collide with node names", () => {
    expect(
      parseTopologyRects({
        nodes: { r1: {}, h1: {} },
        ui: {
          rects: {
            r1: { position: { x: 1, y: 2 }, w: 50, h: 40 },
            "rect-0": { position: { x: 3, y: 4 }, w: 60, h: 50 },
          },
        },
      })
    ).toEqual({ "rect-0": { position: { x: 3, y: 4 }, w: 60, h: 50 } });
  });

  it("keeps rect keys when there are no nodes", () => {
    expect(
      parseTopologyRects({
        ui: { rects: { r1: { position: { x: 0, y: 0 }, w: 10, h: 10 } } },
      })
    ).toEqual({ r1: { position: { x: 0, y: 0 }, w: 10, h: 10 } });
  });
});

describe("nextRectId", () => {
  it("starts at rect-0 when no ids exist", () => {
    expect(nextRectId([])).toBe("rect-0");
  });

  it("seeds the counter from the highest existing rect-N key", () => {
    expect(nextRectId(["rect-0", "rect-2", "rect-1"])).toBe("rect-3");
  });

  it("ignores keys that do not use the rect- prefix", () => {
    expect(nextRectId(["lbl-0", "lbl-5", "r1"])).toBe("rect-0");
  });

  it("skips collisions with non numeric keys", () => {
    expect(nextRectId(["rect-0", "rect-x"])).toBe("rect-1");
  });

  it("is stable against ids already taken by elements", () => {
    const id = nextRectId(["rect-0", "rect-1"]);
    expect(id).toBe("rect-2");
    expect(nextRectId(["rect-0", "rect-1", id])).toBe("rect-3");
  });
});

describe("size constants", () => {
  it("exposes the default and minimum sizes used by the editor", () => {
    expect(DEFAULT_RECT_SIZE).toEqual({ w: 200, h: 120 });
    expect(MIN_RECT_SIZE).toEqual({ w: 40, h: 30 });
    expect(MIN_RECT_SIZE.w).toBeLessThan(DEFAULT_RECT_SIZE.w);
    expect(MIN_RECT_SIZE.h).toBeLessThan(DEFAULT_RECT_SIZE.h);
  });
});

describe("createRect", () => {
  it("adds a default-sized .rect node at the given position and returns its id", () => {
    const cy = cytoscape({ headless: true });
    const id = createRect(cy, { x: 77, y: 42 });

    const node = cy.getElementById(id);
    expect(id).toMatch(/^rect-/);
    expect(node.hasClass("rect")).toBe(true);
    expect(node.position()).toEqual({ x: 77, y: 42 });
    expect(node.data("w")).toBe(DEFAULT_RECT_SIZE.w);
    expect(node.data("h")).toBe(DEFAULT_RECT_SIZE.h);
    cy.destroy();
  });

  it("assigns fresh ids on repeated creations", () => {
    const cy = cytoscape({ headless: true });
    const first = createRect(cy, { x: 0, y: 0 });
    const second = createRect(cy, { x: 10, y: 10 });

    expect(first).toBe("rect-0");
    expect(second).toBe("rect-1");
    cy.destroy();
  });
});

describe("serializeRects and mergeRectsIntoTopology", () => {
  it("maps canvas entries to the file shape", () => {
    expect(
      serializeRects([
        { id: "rect-0", position: { x: 5, y: 6 }, w: 100, h: 80 },
      ])
    ).toEqual({ "rect-0": { position: { x: 5, y: 6 }, w: 100, h: 80 } });
  });

  it("writes ui.rects without disturbing sibling ui keys", () => {
    const topo: { ui?: unknown } = {
      ui: { labels: { "lbl-0": { text: "keep", position: { x: 1, y: 1 } } } },
    };
    mergeRectsIntoTopology(topo, {
      "rect-0": { position: { x: 0, y: 0 }, w: 10, h: 10 },
    });

    expect(topo.ui).toEqual({
      labels: { "lbl-0": { text: "keep", position: { x: 1, y: 1 } } },
      rects: { "rect-0": { position: { x: 0, y: 0 }, w: 10, h: 10 } },
    });
  });

  it("prunes the empty rects map but keeps sibling ui keys", () => {
    const topo: { ui?: unknown } = {
      ui: {
        labels: { "lbl-0": { text: "keep", position: { x: 1, y: 1 } } },
        rects: { "rect-0": { position: { x: 0, y: 0 }, w: 10, h: 10 } },
      },
    };
    mergeRectsIntoTopology(topo, {});

    expect(topo.ui).toEqual({
      labels: { "lbl-0": { text: "keep", position: { x: 1, y: 1 } } },
    });
  });

  it("removes the ui section entirely when rects were its only content", () => {
    const topo: { ui?: unknown } = {
      ui: { rects: { "rect-0": { position: { x: 0, y: 0 }, w: 10, h: 10 } } },
    };
    mergeRectsIntoTopology(topo, {});

    expect("ui" in topo).toBe(false);
  });

  it("leaves an absent ui section absent when there is nothing to write", () => {
    const topo: { ui?: unknown } = {};
    mergeRectsIntoTopology(topo, {});
    expect("ui" in topo).toBe(false);
  });
});
