import { describe, it, expect } from "vitest";
import { parseTopologyLabels, nextLabelId, serializeLabels, mergeLabelsIntoTopology, resolveLabelConfirm } from "./topologyLabels";

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
      "lbl-0": { text: "WAN", position: { x: 10, y: 20 } },
      "lbl-1": { text: "", position: { x: 0, y: 0 } },
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
    ).toEqual({ ok: { text: "kept", position: { x: 1, y: 2 } } });
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
    ).toEqual({ "lbl-0": { text: "kept", position: { x: 3, y: 4 } } });
  });

  it("keeps label keys when there are no nodes", () => {
    expect(
      parseTopologyLabels({
        ui: { labels: { r1: { text: "free", position: { x: 0, y: 0 } } } },
      })
    ).toEqual({ r1: { text: "free", position: { x: 0, y: 0 } } });
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
        { id: "lbl-0", text: "WAN", position: { x: 1, y: 2 } },
        { id: "lbl-3", text: "note", position: { x: 3, y: 4 } },
      ])
    ).toEqual({
      "lbl-0": { text: "WAN", position: { x: 1, y: 2 } },
      "lbl-3": { text: "note", position: { x: 3, y: 4 } },
    });
  });

  it("keeps ids stable for the same canvas entries", () => {
    const entries = [{ id: "lbl-7", text: "a", position: { x: 0, y: 0 } }];
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

describe("mergeLabelsIntoTopology", () => {
  it("creates the ui section when saving labels into a file without one", () => {
    const topo: Record<string, unknown> = { nodes: { r1: null }, links: [] };
    mergeLabelsIntoTopology(topo, { "lbl-0": { text: "hi", position: { x: 1, y: 2 } } });
    expect(topo.ui).toEqual({ labels: { "lbl-0": { text: "hi", position: { x: 1, y: 2 } } } });
  });

  it("preserves other top-level keys and unrelated ui keys", () => {
    const topo: Record<string, unknown> = {
      nodes: { r1: null },
      links: [],
      ui: { somethingElse: { keep: true } },
    };
    mergeLabelsIntoTopology(topo, { "lbl-0": { text: "hi", position: { x: 1, y: 2 } } });
    expect(topo.ui).toEqual({
      somethingElse: { keep: true },
      labels: { "lbl-0": { text: "hi", position: { x: 1, y: 2 } } },
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
    mergeLabelsIntoTopology(topo, serializeLabels([{ id: "lbl-0", text: "new", position: { x: 5, y: 5 } }]));
    expect(topo.ui).toEqual({ labels: { "lbl-0": { text: "new", position: { x: 5, y: 5 } } } });
  });
});
