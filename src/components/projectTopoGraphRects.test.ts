import { describe, it, expect } from "vitest";
import cytoscape from "cytoscape";
import YAML from "yaml";
import { getElements, cyStyle, DECORATION_SELECTOR } from "./ProjectTopoGraph";
import {
  mergeRectsIntoTopology,
  serializeRects,
} from "./topologyRects";
import {
  mergeLabelsIntoTopology,
  serializeLabels,
} from "./topologyLabels";
import { IProjectState } from "../api/interface";

const PRJ_STATE: IProjectState = {
  id: "abc",
  name: "proj",
  openAt: "now",
  running: false,
  nodes: [],
};

const TOPOLOGY = {
  nodes: {
    r1: { type: "docker.router", ui: { icon: "router" as const, position: { x: 10, y: 10 } } },
    h1: { type: "docker.host", ui: { position: { x: 50, y: 50 } } },
  },
  links: [{ peer1: "r1.0", peer2: "h1.0" }],
  ui: {
    labels: {
      "lbl-0": { text: "WAN", position: { x: 300, y: 90 } },
    },
    rects: {
      "rect-0": { position: { x: 40, y: 40 }, w: 200, h: 120 },
      r1: { position: { x: 0, y: 0 }, w: 10, h: 10 },
      broken: { position: { x: 0, y: 0 }, w: 0, h: 10 },
    },
  },
};

const getRectElements = () =>
  getElements(TOPOLOGY, PRJ_STATE).filter(
    (el) => el.group == "nodes" && el.classes == "rect"
  );

describe("rect elements from getElements", () => {
  it("emits one rect-classed node per valid ui.rects entry", () => {
    const rects = getRectElements();
    expect(rects).toHaveLength(1);
    expect(rects[0].data).toEqual({ id: "rect-0", w: 200, h: 120 });
    expect(rects[0].position).toEqual({ x: 40, y: 40 });
  });

  it("skips a rect key colliding with a node name and malformed entries", () => {
    const ids = getRectElements().map((el) => el.data?.id);
    expect(ids).not.toContain("r1");
    expect(ids).not.toContain("broken");
    expect(getElements(TOPOLOGY, PRJ_STATE).some((el) => el.data?.id == "r1")).toBe(true);
  });

  it("renders nothing extra for a file without ui.rects", () => {
    const withoutRects = { ...TOPOLOGY, ui: { labels: TOPOLOGY.ui.labels } };
    const before = getElements(withoutRects, PRJ_STATE).map((el) => el.data?.id);
    const after = getElements(
      { ...TOPOLOGY, ui: { labels: TOPOLOGY.ui.labels, rects: {} } },
      PRJ_STATE
    ).map((el) => el.data?.id);
    expect(after).toEqual(before);
  });
});

describe("rect style rules", () => {
  it("declares the decoration style for the node.rect selector", () => {
    const rule = cyStyle.find(
      (r) => "selector" in r && r.selector == "node.rect"
    ) as { style?: { [key: string]: unknown } } | undefined;
    expect(rule).toBeDefined();
    const style = rule?.style ?? {};
    expect(style["background-opacity"]).toBe(0);
    expect(style["border-style"]).toBe("dotted");
    expect(Number(style["border-width"])).toBeGreaterThan(0);
    expect(style["width"]).toBe("data(w)");
    expect(style["height"]).toBe("data(h)");
    expect(style["label"]).toBe("");
    expect(Number(style["z-index"])).toBeLessThan(0);
  });
});

describe("decorations share one exclusion selector", () => {
  it("matches labels and rects with DECORATION_SELECTOR", () => {
    expect(DECORATION_SELECTOR).toBe(".label, .rect");

    const cy = cytoscape({
      headless: true,
      style: cyStyle,
      elements: getElements(TOPOLOGY, PRJ_STATE),
      layout: { name: "preset" },
    });
    expect(cy.nodes().filter(DECORATION_SELECTOR).map((n) => n.id()).sort())
      .toEqual(["lbl-0", "rect-0"]);
    expect(cy.nodes().not(DECORATION_SELECTOR).map((n) => n.id()).sort())
      .toEqual(["h1", "r1"]);
    cy.destroy();
  });
});

describe("layouts skip rects", () => {
  it("keeps rect position and size while rearranging network nodes", async () => {
    const cy = cytoscape({
      headless: true,
      style: cyStyle,
      elements: getElements(TOPOLOGY, PRJ_STATE),
      layout: { name: "preset" },
    });

    const rect = cy.getElementById("rect-0");
    const beforePos = rect.position();
    const beforeSize = { w: rect.data("w"), h: rect.data("h") };

    const layout = cy
      .nodes()
      .not(DECORATION_SELECTOR)
      .layout({ name: "grid", animate: false });
    await new Promise<void>((resolve) => {
      layout.one("stop layoutstop", () => resolve());
      layout.run();
    });

    expect(rect.position()).toEqual(beforePos);
    expect({ w: rect.data("w"), h: rect.data("h") }).toEqual(beforeSize);
    expect(cy.getElementById("r1").position()).not.toEqual({ x: 10, y: 10 });
    cy.destroy();
  });
});

describe("save round-trip through YAML", () => {
  const FILE =
    "nodes:\n  r1:\n    type: docker.router\n    ui:\n      icon: router\n      position:\n        x: 10\n        y: 10\nlinks:\n  - peer1: r1.0\n    peer2: r1.1\n";

  // mirrors what saveNodePositions collects from the canvas
  const collect = (cy: cytoscape.Core) =>
    cy.nodes(".rect").map((n) => ({
      id: n.id(),
      position: n.position(),
      w: Number(n.data("w")),
      h: Number(n.data("h")),
    }));

  it("adds ui.rects while preserving nodes, links and labels", () => {
    const cy = cytoscape({
      headless: true,
      style: cyStyle,
      elements: getElements(TOPOLOGY, PRJ_STATE),
      layout: { name: "preset" },
    });

    const topo = YAML.parse(FILE);
    mergeLabelsIntoTopology(topo, serializeLabels([
      { id: "lbl-0", text: "WAN", position: { x: 300, y: 90 } },
    ]));
    mergeRectsIntoTopology(topo, serializeRects(collect(cy)));

    const saved = YAML.parse(YAML.stringify(topo));
    expect(saved.ui.rects).toEqual({
      "rect-0": { position: { x: 40, y: 40 }, w: 200, h: 120 },
    });
    expect(saved.ui.labels).toEqual({
      "lbl-0": { text: "WAN", position: { x: 300, y: 90 } },
    });
    expect(saved.nodes.r1).toEqual({
      type: "docker.router",
      ui: { icon: "router", position: { x: 10, y: 10 } },
    });
    expect(saved.links).toEqual([{ peer1: "r1.0", peer2: "r1.1" }]);
    cy.destroy();
  });

  it("keeps the rect- id across move, resize and repeated saves", () => {
    const cy = cytoscape({
      headless: true,
      style: cyStyle,
      elements: getElements(TOPOLOGY, PRJ_STATE),
      layout: { name: "preset" },
    });

    const rect = cy.getElementById("rect-0");
    rect.position({ x: 90, y: 60 });
    rect.data({ w: 150, h: 90 });

    const firstTopo = YAML.parse(FILE);
    mergeRectsIntoTopology(firstTopo, serializeRects(collect(cy)));
    const first = YAML.parse(YAML.stringify(firstTopo));
    expect(Object.keys(first.ui.rects)).toEqual(["rect-0"]);
    expect(first.ui.rects["rect-0"]).toEqual({
      position: { x: 90, y: 60 },
      w: 150,
      h: 90,
    });

    rect.position({ x: 120, y: 70 });
    const secondTopo = YAML.parse(YAML.stringify(first));
    mergeRectsIntoTopology(secondTopo, serializeRects(collect(cy)));
    const second = YAML.parse(YAML.stringify(secondTopo));
    expect(Object.keys(second.ui.rects)).toEqual(["rect-0"]);
    expect(second.ui.rects["rect-0"].position).toEqual({ x: 120, y: 70 });
    cy.destroy();
  });

  it("drops the entry of a deleted rect and prunes ui when it was the only content", () => {
    const cy = cytoscape({
      headless: true,
      style: cyStyle,
      elements: getElements(TOPOLOGY, PRJ_STATE),
      layout: { name: "preset" },
    });
    cy.getElementById("rect-0").remove();

    const topo = YAML.parse(FILE);
    mergeRectsIntoTopology(topo, serializeRects(collect(cy)));
    const saved = YAML.parse(YAML.stringify(topo));
    expect("ui" in saved).toBe(false);
    expect(saved.nodes.r1).toBeDefined();
    cy.destroy();
  });
});
