import { describe, it, expect } from "vitest";
import cytoscape from "cytoscape";
import { applyLabelConfirm, parseTopologyLabels, nextLabelId, serializeLabels, mergeLabelsIntoTopology, resolveLabelConfirm } from "./topologyLabels";

describe("parseTopologyLabels", () => {
  it("parses valid labels from the top-level ui section", () => {
    expect(
      parseTopologyLabels({
        nodes: { r1: {}, h1: null },
        ui: {
          labels: {
            "lbl-0": { text: "WAN", position: { x: 10, y: 20 } },
            "lbl-1": { text: "", position: { x: 0, y: 0 } },
          },
        },
      })
    ).toEqual({
      "lbl-0": { text: "WAN", kind: "subnet", position: { x: 10, y: 20 } },
      "lbl-1": { text: "", kind: "subnet", position: { x: 0, y: 0 } },
    });
  });

  it("parses explicit kinds and defaults missing or unknown kinds to subnet", () => {
    expect(
      parseTopologyLabels({
        ui: {
          labels: {
            "lbl-0": { text: "as label", kind: "as", position: { x: 0, y: 0 } },
            "lbl-1": { text: "subnet label", kind: "subnet", position: { x: 0, y: 0 } },
            "lbl-2": { text: "legacy", position: { x: 0, y: 0 } },
            "lbl-3": { text: "weird", kind: "router", position: { x: 0, y: 0 } },
            "lbl-4": { text: "weird obj", kind: { name: "as" }, position: { x: 0, y: 0 } },
          },
        },
      })
    ).toEqual({
      "lbl-0": { text: "as label", kind: "as", position: { x: 0, y: 0 } },
      "lbl-1": { text: "subnet label", kind: "subnet", position: { x: 0, y: 0 } },
      "lbl-2": { text: "legacy", kind: "subnet", position: { x: 0, y: 0 } },
      "lbl-3": { text: "weird", kind: "subnet", position: { x: 0, y: 0 } },
      "lbl-4": { text: "weird obj", kind: "subnet", position: { x: 0, y: 0 } },
    });
  });

  it("returns an empty map when the ui section is absent or malformed", () => {
    expect(parseTopologyLabels({ nodes: { r1: {} } })).toEqual({});
    expect(parseTopologyLabels(null)).toEqual({});
    expect(parseTopologyLabels(undefined)).toEqual({});
    expect(parseTopologyLabels("topo")).toEqual({});
    expect(parseTopologyLabels({ ui: "labels:" })).toEqual({});
    expect(parseTopologyLabels({ ui: ["labels"] })).toEqual({});
    expect(parseTopologyLabels({ ui: { labels: [] } })).toEqual({});
    expect(parseTopologyLabels({ ui: { labels: null } })).toEqual({});
  });

  it("skips entries with malformed shapes", () => {
    expect(
      parseTopologyLabels({
        ui: {
          labels: {
            ok: { text: "kept", position: { x: 1, y: 2 } },
            notObj: "just text",
            nullEntry: null,
            noText: { position: { x: 1, y: 2 } },
            badText: { text: 42, position: { x: 1, y: 2 } },
            noPosition: { text: "gone" },
            badPosition: { text: "gone", position: { x: "10", y: 2 } },
            nanPosition: { text: "gone", position: { x: NaN, y: 2 } },
          },
        },
      })
    ).toEqual({ ok: { text: "kept", kind: "subnet", position: { x: 1, y: 2 } } });
  });

  it("skips label keys that collide with node names", () => {
    expect(
      parseTopologyLabels({
        nodes: { r1: {}, h1: {} },
        ui: {
          labels: {
            r1: { text: "collider", position: { x: 1, y: 2 } },
            "lbl-0": { text: "kept", position: { x: 3, y: 4 } },
          },
        },
      })
    ).toEqual({ "lbl-0": { text: "kept", kind: "subnet", position: { x: 3, y: 4 } } });
  });

  it("keeps label keys when there are no nodes", () => {
    expect(
      parseTopologyLabels({
        ui: { labels: { r1: { text: "free", position: { x: 0, y: 0 } } } },
      })
    ).toEqual({ r1: { text: "free", kind: "subnet", position: { x: 0, y: 0 } } });
  });
});

describe("nextLabelId", () => {
  it("starts at lbl-0 when no ids exist", () => {
    expect(nextLabelId([])).toBe("lbl-0");
  });

  it("seeds the counter from the highest existing lbl-N key", () => {
    expect(nextLabelId(["lbl-0", "lbl-2", "lbl-1"])).toBe("lbl-3");
  });

  it("ignores keys that do not use the lbl- prefix", () => {
    expect(nextLabelId(["r1", "note42"])).toBe("lbl-0");
  });

  it("never returns a key that already exists", () => {
    for (const key of ["lbl-0", "lbl-3", "lbl-9", "lbl-4"]) {
      expect(nextLabelId(["lbl-0", "lbl-3", "lbl-9", "lbl-4"])).not.toBe(key);
    }
    expect(nextLabelId(["lbl-9"])).toBe("lbl-10");
  });
});

describe("serializeLabels", () => {
  it("maps canvas entries to the ui.labels shape", () => {
    expect(
      serializeLabels([
        { id: "lbl-0", text: "WAN", kind: "subnet", position: { x: 1, y: 2 } },
        { id: "lbl-3", text: "note", kind: "as", position: { x: 3, y: 4 } },
      ])
    ).toEqual({
      "lbl-0": { text: "WAN", kind: "subnet", position: { x: 1, y: 2 } },
      "lbl-3": { text: "note", kind: "as", position: { x: 3, y: 4 } },
    });
  });

  it("round-trips parsed labels preserving kinds", () => {
    const parsed = parseTopologyLabels({
      ui: {
        labels: {
          "lbl-0": { text: "AS 65001", kind: "as", position: { x: 1, y: 1 } },
          "lbl-1": { text: "LAN", kind: "subnet", position: { x: 2, y: 2 } },
        },
      },
    });
    const entries = Object.keys(parsed).map((id) => ({ id, ...parsed[id] }));
    expect(serializeLabels(entries)).toEqual({
      "lbl-0": { text: "AS 65001", kind: "as", position: { x: 1, y: 1 } },
      "lbl-1": { text: "LAN", kind: "subnet", position: { x: 2, y: 2 } },
    });
  });

  it("serializes kindless legacy parses with an explicit subnet kind", () => {
    const parsed = parseTopologyLabels({
      ui: { labels: { "lbl-0": { text: "legacy", position: { x: 0, y: 0 } } } },
    });
    const entries = Object.keys(parsed).map((id) => ({ id, ...parsed[id] }));
    expect(serializeLabels(entries)).toEqual({
      "lbl-0": { text: "legacy", kind: "subnet", position: { x: 0, y: 0 } },
    });
  });

  it("keeps ids stable for the same canvas entries", () => {
    const entries = [{ id: "lbl-7", text: "a", kind: "subnet" as const, position: { x: 0, y: 0 } }];
    expect(serializeLabels(entries)).toEqual(serializeLabels(entries));
    expect(Object.keys(serializeLabels(entries))).toEqual(["lbl-7"]);
  });

  it("returns an empty map for no labels", () => {
    expect(serializeLabels([])).toEqual({});
  });
});

describe("resolveLabelConfirm", () => {
  it("adds trimmed text in add mode", () => {
    expect(resolveLabelConfirm("add", "  WAN link  ")).toEqual({ action: "create", text: "WAN link" });
  });

  it("does nothing in add mode with empty or whitespace text", () => {
    expect(resolveLabelConfirm("add", "")).toEqual({ action: "noop" });
    expect(resolveLabelConfirm("add", "   \t ")).toEqual({ action: "noop" });
  });

  it("updates with trimmed text in edit mode", () => {
    expect(resolveLabelConfirm("edit", " new text ")).toEqual({ action: "update", text: "new text" });
  });

  it("deletes in edit mode when text becomes empty", () => {
    expect(resolveLabelConfirm("edit", "")).toEqual({ action: "delete" });
    expect(resolveLabelConfirm("edit", "  ")).toEqual({ action: "delete" });
  });
});

describe("applyLabelConfirm kinds", () => {
  const makeCy = () => {
    const cy = cytoscape({ headless: true });
    cy.add({
      group: "nodes",
      data: { id: "lbl-0", text: "WAN", kind: "subnet" },
      position: { x: 300, y: 90 },
      classes: "label label-subnet",
    });
    return cy;
  };

  it("defaults the created label kind to subnet", () => {
    const cy = makeCy();
    applyLabelConfirm(cy, "add", "note", "", { x: 1, y: 2 });

    const created = cy.nodes().filter((n) => n.id() !== "lbl-0");
    expect(created.length).toBe(1);
    expect(created[0].classes()).toContain("label-subnet");
    expect(created[0].data("kind")).toBe("subnet");
    cy.destroy();
  });

  it("creates a label with the chosen as kind", () => {
    const cy = makeCy();
    applyLabelConfirm(cy, "add", "AS 65001", "", { x: 1, y: 2 }, "as");

    const created = cy.nodes().filter((n) => n.id() !== "lbl-0");
    expect(created[0].classes()).toContain("label-as");
    expect(created[0].classes()).not.toContain("label-subnet");
    expect(created[0].data("kind")).toBe("as");
    cy.destroy();
  });

  it("updates the kind in place, keeping id and position", () => {
    const cy = makeCy();
    const beforePos = cy.getElementById("lbl-0").position();

    applyLabelConfirm(cy, "edit", "AS 65001", "lbl-0", { x: 0, y: 0 }, "as");

    const lbl = cy.getElementById("lbl-0");
    expect(lbl.nonempty()).toBe(true);
    expect(lbl.data("text")).toBe("AS 65001");
    expect(lbl.data("kind")).toBe("as");
    expect(lbl.classes()).toContain("label-as");
    expect(lbl.classes()).not.toContain("label-subnet");
    expect(lbl.position()).toEqual(beforePos);
    cy.destroy();
  });

  it("switches the kind back to subnet on edit", () => {
    const cy = makeCy();
    applyLabelConfirm(cy, "edit", "AS 65001", "lbl-0", { x: 0, y: 0 }, "as");
    applyLabelConfirm(cy, "edit", "WAN", "lbl-0", { x: 0, y: 0 }, "subnet");

    const lbl = cy.getElementById("lbl-0");
    expect(lbl.data("kind")).toBe("subnet");
    expect(lbl.classes()).toContain("label-subnet");
    expect(lbl.classes()).not.toContain("label-as");
    cy.destroy();
  });
});

describe("mergeLabelsIntoTopology", () => {
  it("creates the ui section when saving labels into a file without one", () => {
    const topo: Record<string, unknown> = { nodes: { r1: null }, links: [] };
    mergeLabelsIntoTopology(topo, { "lbl-0": { text: "hi", kind: "subnet", position: { x: 1, y: 2 } } });
    expect(topo.ui).toEqual({ labels: { "lbl-0": { text: "hi", kind: "subnet", position: { x: 1, y: 2 } } } });
  });

  it("preserves other top-level keys and unrelated ui keys", () => {
    const topo: Record<string, unknown> = {
      nodes: { r1: null },
      links: [],
      ui: { somethingElse: { keep: true } },
    };
    mergeLabelsIntoTopology(topo, { "lbl-0": { text: "hi", kind: "subnet", position: { x: 1, y: 2 } } });
    expect(topo.ui).toEqual({
      somethingElse: { keep: true },
      labels: { "lbl-0": { text: "hi", kind: "subnet", position: { x: 1, y: 2 } } },
    });
    expect(topo.nodes).toEqual({ r1: null });
  });

  it("omits the whole ui section when no labels remain and ui only held labels", () => {
    const topo: Record<string, unknown> = { nodes: {}, ui: { labels: { "lbl-0": { text: "x", position: { x: 0, y: 0 } } } } };
    mergeLabelsIntoTopology(topo, {});
    expect("ui" in topo).toBe(false);
  });

  it("keeps a non-labels ui section when no labels remain", () => {
    const topo: Record<string, unknown> = { ui: { labels: {}, somethingElse: 1 } };
    mergeLabelsIntoTopology(topo, {});
    expect(topo.ui).toEqual({ somethingElse: 1 });
  });

  it("does not create a ui section when saving zero labels over a file without one", () => {
    const topo: Record<string, unknown> = { nodes: {} };
    mergeLabelsIntoTopology(topo, {});
    expect("ui" in topo).toBe(false);
  });

  it("replaces the previous labels entirely on save", () => {
    const topo: Record<string, unknown> = { ui: { labels: { "lbl-9": { text: "gone", position: { x: 0, y: 0 } } } } };
    mergeLabelsIntoTopology(topo, serializeLabels([{ id: "lbl-0", text: "new", kind: "as", position: { x: 5, y: 5 } }]));
    expect(topo.ui).toEqual({ labels: { "lbl-0": { text: "new", kind: "as", position: { x: 5, y: 5 } } } });
  });
});
