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
      "lbl-1": { text: "AS 65001", kind: "as", position: { x: 400, y: 40 } },
      r1: { text: "collider", position: { x: 0, y: 0 } },
    },
  },
};

const hasClass = (def: { classes?: string | string[] }, cls: string) =>
  Array.isArray(def.classes)
    ? def.classes.includes(cls)
    : (def.classes ?? "").split(" ").includes(cls);

const getLabelElements = () =>
  getElements(TOPOLOGY, PRJ_STATE).filter(
    (el) => el.group == "nodes" && hasClass(el, "label")
  );

describe("label elements from getElements", () => {
  it("emits one label-classed node per valid ui.labels entry", () => {
    const labels = getLabelElements();
    expect(labels.map((el) => el.data?.id)).toEqual(["lbl-0", "lbl-1"]);
    expect(labels[0].position).toEqual({ x: 300, y: 90 });
  });

  it("gives labels kind classes and kind data from explicit and legacy kinds", () => {
    const byId = Object.fromEntries(getLabelElements().map((el) => [el.data?.id, el]));
    expect(byId["lbl-0"].classes).toBe("label label-subnet");
    expect(byId["lbl-0"].data).toEqual({
      id: "lbl-0",
      text: "WAN -- 10ms latency budget that is quite long",
      kind: "subnet",
    });
    expect(byId["lbl-1"].classes).toBe("label label-as");
    expect(byId["lbl-1"].data).toEqual({ id: "lbl-1", text: "AS 65001", kind: "as" });
  });

  it("skips a label key colliding with a node name", () => {
    expect(getLabelElements().map((el) => el.data?.id)).not.toContain("r1");
    expect(getElements(TOPOLOGY, PRJ_STATE).some((el) => el.data?.id == "r1")).toBe(true);
  });
});

describe("label style rules", () => {
  const styleFor = (selector: string) => {
    const rule = cyStyle.find(
      (r) => "selector" in r && r.selector == selector
    ) as { style?: { [key: string]: unknown } } | undefined;
    expect(rule).toBeDefined();
    return rule?.style ?? {};
  };

  it("keeps shared geometry and text settings on the node.label selector", () => {
    const style = styleFor("node.label");
    expect(style["label"]).toBe("data(text)");
    expect(style["text-wrap"]).toBe("wrap");
    expect(style["text-max-width"]).toBe("180");
    expect(style["background-image"]).toBe("none");
    expect(style["width"]).toBe("label");
    expect(style["height"]).toBe("label");
  });

  it("keeps the sticky-note look on the node.label-subnet selector", () => {
    const style = styleFor("node.label-subnet");
    expect(style["shape"]).toBe("round-rectangle");
    expect(style["background-color"]).toBe("#fffbe6");
    expect(style["border-width"]).toBe(1);
    expect(style["border-color"]).toBe("#d6c98a");
  });

  it("styles the node.label-as selector as borderless bold text", () => {
    const style = styleFor("node.label-as");
    expect(style["background-opacity"]).toBe(0);
    expect(style["border-width"]).toBe(0);
    expect(style["font-weight"]).toBe("bold");
    expect(style["font-size"]).toBe(14);
    expect(style["color"]).toBe("#0e7490");
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
      { id: "lbl-0", text: "WAN", kind: "subnet", position: { x: 300, y: 90 } },
    ]));

    const saved = YAML.parse(YAML.stringify(topo));
    expect(saved.ui.labels).toEqual({ "lbl-0": { text: "WAN", kind: "subnet", position: { x: 300, y: 90 } } });
    expect(saved.nodes.r1).toEqual({ type: "docker.router", ui: { icon: "router", position: { x: 10, y: 10 } } });
    expect(saved.links).toEqual([{ peer1: "r1.0", peer2: "r1.1" }]);
  });

  it("writes the kind explicitly for every saved label entry", () => {
    const topo = YAML.parse("nodes: {}\n");
    mergeLabelsIntoTopology(topo, serializeLabels([
      { id: "lbl-0", text: "AS 65001", kind: "as", position: { x: 1, y: 1 } },
      { id: "lbl-1", text: "LAN", kind: "subnet", position: { x: 2, y: 2 } },
    ]));

    const saved = YAML.parse(YAML.stringify(topo));
    expect(saved.ui.labels).toEqual({
      "lbl-0": { text: "AS 65001", kind: "as", position: { x: 1, y: 1 } },
      "lbl-1": { text: "LAN", kind: "subnet", position: { x: 2, y: 2 } },
    });
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
    const beforeIds = new Set(cy.nodes(".label").map((n) => n.id()));
    applyLabelConfirm(cy, "add", "New note", "", { x: 77, y: 42 });

    const created = cy.nodes(".label").filter((n) => !beforeIds.has(n.id()));
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

describe("label modal confirm flow (headless graph)", () => {
  const makeCy = () =>
    cytoscape({
      headless: true,
      style: cyStyle,
      elements: getElements(TOPOLOGY, PRJ_STATE),
    });

  it("add with the default modal kind creates a subnet label", () => {
    const cy = makeCy();
    const beforeIds = new Set(cy.nodes(".label").map((n) => n.id()));
    // the component opens the add modal with kind "subnet" and passes it through
    applyLabelConfirm(cy, "add", "WAN budget", "", { x: 12, y: 34 }, "subnet");

    const created = cy.nodes(".label").filter((n) => !beforeIds.has(n.id()));
    expect(created.length).toBe(1);
    expect(created[0].classes()).toContain("label-subnet");
    expect(created[0].data("kind")).toBe("subnet");
    cy.destroy();
  });

  it("add with the as kind creates an as-styled label", () => {
    const cy = makeCy();
    const beforeIds = new Set(cy.nodes(".label").map((n) => n.id()));
    applyLabelConfirm(cy, "add", "AS 65002", "", { x: 12, y: 34 }, "as");

    const created = cy.nodes(".label").filter((n) => !beforeIds.has(n.id()));
    expect(created[0].classes()).toContain("label-as");
    expect(created[0].classes()).not.toContain("label-subnet");
    expect(created[0].data("kind")).toBe("as");
    cy.destroy();
  });

  it("edit kind change keeps text, id and position and flips the class", () => {
    const cy = makeCy();
    const lbl0 = cy.getElementById("lbl-0");
    const beforePos = lbl0.position();

    // dbltap prefills the modal from element data, then confirm passes it back
    const initialKind = String(lbl0.data("kind")) == "as" ? "as" : "subnet";
    expect(initialKind).toBe("subnet");
    applyLabelConfirm(cy, "edit", "WAN", "lbl-0", beforePos, "as");

    const edited = cy.getElementById("lbl-0");
    expect(edited.nonempty()).toBe(true);
    expect(edited.data("text")).toBe("WAN");
    expect(edited.data("kind")).toBe("as");
    expect(edited.classes()).toContain("label-as");
    expect(edited.classes()).not.toContain("label-subnet");
    expect(edited.position()).toEqual(beforePos);
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
