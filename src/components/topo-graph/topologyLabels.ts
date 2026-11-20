import type cytoscape from "cytoscape";

export type LabelKind = "as" | "subnet";

export interface TopologyLabel {
  text: string;
  kind: LabelKind;
  position: { x: number; y: number };
}

export type TopologyLabelMap = { [id: string]: TopologyLabel };

const LABEL_ID_PREFIX = "lbl-";

const isPlainObject = (value: unknown): value is { [key: string]: unknown } =>
  typeof value == "object" && value != null && !Array.isArray(value);

const isValidPosition = (value: unknown): value is { x: number; y: number } =>
  isPlainObject(value) &&
  typeof value.x == "number" && isFinite(value.x) &&
  typeof value.y == "number" && isFinite(value.y);

export function parseTopologyLabels(topo: unknown): TopologyLabelMap {
  const labels: TopologyLabelMap = {};
  if (!isPlainObject(topo)) return labels;

  const nodeNames = new Set(
    isPlainObject(topo.nodes) ? Object.keys(topo.nodes) : []
  );

  const ui = topo.ui;
  if (!isPlainObject(ui)) return labels;

  const rawLabels = ui.labels;
  if (!isPlainObject(rawLabels)) return labels;

  Object.keys(rawLabels).forEach((id) => {
    if (nodeNames.has(id)) return;

    const entry = rawLabels[id];
    if (!isPlainObject(entry)) return;
    if (typeof entry.text != "string") return;
    if (!isValidPosition(entry.position)) return;

    labels[id] = {
      text: entry.text,
      kind: entry.kind == "as" ? "as" : "subnet",
      position: { x: entry.position.x, y: entry.position.y },
    };
  });

  return labels;
}

export function nextLabelId(existingKeys: Iterable<string>): string {
  const keys = new Set(existingKeys);

  let seed = 0;
  keys.forEach((key) => {
    if (!key.startsWith(LABEL_ID_PREFIX)) return;
    const num = Number(key.slice(LABEL_ID_PREFIX.length));
    if (isFinite(num) && num >= seed) seed = num + 1;
  });

  let id = `${LABEL_ID_PREFIX}${seed}`;
  while (keys.has(id)) {
    seed += 1;
    id = `${LABEL_ID_PREFIX}${seed}`;
  }
  return id;
}

export function serializeLabels(
  entries: readonly {
    id: string;
    text: string;
    kind: LabelKind;
    position: { x: number; y: number };
  }[]
): TopologyLabelMap {
  const labels: TopologyLabelMap = {};
  entries.forEach((entry) => {
    labels[entry.id] = {
      text: entry.text,
      kind: entry.kind,
      position: { x: entry.position.x, y: entry.position.y },
    };
  });
  return labels;
}

export type LabelConfirmResult =
  | { action: "noop" }
  | { action: "create"; text: string }
  | { action: "update"; text: string }
  | { action: "delete" };

const KIND_CLASSES = "label-as label-subnet";

export function applyLabelConfirm(
  cy: cytoscape.Core,
  mode: "add" | "edit",
  rawText: string,
  editId: string,
  position: { x: number; y: number },
  kind: LabelKind = "subnet"
): void {
  const result = resolveLabelConfirm(mode, rawText);

  switch (result.action) {
    case "create":
      cy.add({
        group: "nodes",
        data: {
          id: nextLabelId(cy.elements().map((el) => el.id())),
          text: result.text,
          kind,
        },
        position: { ...position },
        classes: `label label-${kind}`,
      });
      break;
    case "update": {
      const el = cy.getElementById(editId);
      el.data("text", result.text);
      el.data("kind", kind);
      el.removeClass(KIND_CLASSES).addClass(`label-${kind}`);
      break;
    }
    case "delete":
      cy.getElementById(editId).remove();
      break;
    case "noop":
      break;
  }
}

export function resolveLabelConfirm(
  mode: "add" | "edit",
  rawText: string
): LabelConfirmResult {
  const text = rawText.trim();
  if (mode == "add")
    return text == "" ? { action: "noop" } : { action: "create", text };
  return text == "" ? { action: "delete" } : { action: "update", text };
}

export function mergeLabelsIntoTopology(
  topo: { ui?: unknown },
  labels: TopologyLabelMap
): void {
  if (Object.keys(labels).length == 0) {
    if (!isPlainObject(topo.ui)) {
      delete topo.ui;
      return;
    }

    const { labels: _labels, ...restUi } = topo.ui;
    if (Object.keys(restUi).length == 0)
      delete topo.ui;
    else
      topo.ui = restUi;
    return;
  }

  topo.ui = {
    ...(isPlainObject(topo.ui) ? topo.ui : {}),
    labels,
  };
}
