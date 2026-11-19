import { describe, it, expect } from "vitest";
import cytoscape from "cytoscape";
import YAML from "yaml";
import { getElements, cyStyle } from "./ProjectTopoGraph";
import { applyLabelConfirm, mergeLabelsIntoTopology, serializeLabels } from "./topologyLabels";
import { IProjectState } from "../../api/interface";

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
      "lbl-0": { text: "WAN -- 10ms latency budget that is quite long", position: { x: 300, y: 90 } },
      r1: { text: "collider", position: { x: 0, y: 0 } },
    },
  },
};

const getLabelElements = () =>
  getElements(TOPOLOGY, PRJ_STATE).filter(
    (el) => el.group == "nodes" && el.classes == "label"
  );

describe("label elements from getElements", () => {
  it("emits one label-classed node per valid ui.labels entry", () => {
    const labels = getLabelElements();
    expect(labels).toHaveLength(1);
    expect(labels[0].data).toEqual({ id: "lbl-0", text: "WAN -- 10ms latency budget that is quite long" });
    expect(labels[0].position).toEqual({ x: 300, y: 90 });
  });

  it("skips a label key colliding with a node name", () => {
    expect(getLabelElements().map((el) => el.data?.id)).not.toContain("r1");
    expect(getElements(TOPOLOGY, PRJ_STATE).some((el) => el.data?.id == "r1")).toBe(true);
  });
});

describe("label style rules", () => {
  it("declares the annotation style for the node.label selector", () => {
    const rule = cyStyle.find(
      (r) => "selector" in r && r.selector == "node.label"
    ) as { style?: { [key: string]: unknown } } | undefined;
    expect(rule).toBeDefined();
    const style = rule?.style ?? {};
    expect(style["shape"]).toBe("round-rectangle");
    expect(style["label"]).toBe("data(text)");
    expect(style["text-wrap"]).toBe("wrap");
    expect(style["text-max-width"]).toBe("180");
    expect(style["background-image"]).toBe("none");
    expect(style["width"]).toBe("label");
    expect(style["height"]).toBe("label");
  });

  it("keeps network nodes on the base node rule", () => {
    const base = cyStyle.find(
      (r) => "selector" in r && r.selector == "node"
    ) as { style?: { [key: string]: unknown } } | undefined;
    const baseStyle = base?.style ?? {};
    expect(baseStyle["shape"]).toBe("rectangle");
    expect(baseStyle["label"]).toBe("data(name)");
  });
});

describe("save round-trip through YAML", () => {
  it("adds ui.labels while preserving nodes and links", () => {
    const file = "nodes:\n  r1:\n    type: docker.router\n    ui:\n      icon: router\n      position:\n        x: 10\n        y: 10\nlinks:\n  - peer1: r1.0\n    peer2: r1.1\n";
    const topo = YAML.parse(file);
    mergeLabelsIntoTopology(topo, serializeLabels([
      { id: "lbl-0", text: "WAN", position: { x: 300, y: 90 } },
    ]));

    const saved = YAML.parse(YAML.stringify(topo));
    expect(saved.ui.labels).toEqual({ "lbl-0": { text: "WAN", position: { x: 300, y: 90 } } });
    expect(saved.nodes.r1).toEqual({ type: "docker.router", ui: { icon: "router", position: { x: 10, y: 10 } } });
    expect(saved.links).toEqual([{ peer1: "r1.0", peer2: "r1.1" }]);
  });

  it("removes the ui section when the last label is gone", () => {
    const file = "nodes: {}\nui:\n  labels:\n    lbl-0:\n      text: bye\n      position: { x: 0, y: 0 }\n";
    const topo = YAML.parse(file);
    mergeLabelsIntoTopology(topo, {});

    const saved = YAML.parse(YAML.stringify(topo));
    expect("ui" in saved).toBe(false);
    expect(saved.nodes).toEqual({});
  });
});

describe("applyLabelConfirm (headless graph)", () => {
  const makeCy = () =>
    cytoscape({
      headless: true,
      style: cyStyle,
      elements: getElements(TOPOLOGY, PRJ_STATE),
    });

  it("creates a label node at the clicked position on add", () => {
    const cy = makeCy();
    applyLabelConfirm(cy, "add", "New note", "", { x: 77, y: 42 });

    const created = cy.nodes(".label").filter((n) => n.id() !== "lbl-0");
    expect(created.length).toBe(1);
    expect(created[0].data("text")).toBe("New note");
    expect(created[0].position()).toEqual({ x: 77, y: 42 });
    expect(created[0].id()).toMatch(/^lbl-/);
    cy.destroy();
  });

  it("does nothing when add is confirmed with empty text", () => {
    const cy = makeCy();
    const before = cy.nodes(".label").length;
    applyLabelConfirm(cy, "add", "   ", "", { x: 1, y: 1 });
    expect(cy.nodes(".label").length).toBe(before);
    cy.destroy();
  });

  it("updates label text in place on edit", () => {
    const cy = makeCy();
    const beforePos = cy.getElementById("lbl-0").position();
    applyLabelConfirm(cy, "edit", "Edited", "lbl-0", { x: 0, y: 0 });

    const lbl = cy.getElementById("lbl-0");
    expect(lbl.data("text")).toBe("Edited");
    expect(lbl.position()).toEqual(beforePos);
    cy.destroy();
  });

  it("removes the label when edit is confirmed with empty text", () => {
    const cy = makeCy();
    applyLabelConfirm(cy, "edit", "", "lbl-0", { x: 0, y: 0 });
    expect(cy.getElementById("lbl-0").length).toBe(0);
    cy.destroy();
  });
});

describe("layouts skip labels", () => {
  it("keeps label positions while rearranging network nodes", async () => {
    const cy = cytoscape({
      headless: true,
      style: cyStyle,
      elements: getElements(TOPOLOGY, PRJ_STATE),
    });

    const before = cy.getElementById("lbl-0").position();
    const layout = cy.nodes().not(".label").layout({ name: "grid", animate: false });
    await new Promise<void>((resolve) => {
      layout.one("stop layoutstop", () => resolve());
      layout.run();
    });

    expect(cy.getElementById("lbl-0").position()).toEqual(before);
    expect(cy.getElementById("r1").position()).not.toEqual({ x: 10, y: 10 });
    cy.destroy();
  });
});
