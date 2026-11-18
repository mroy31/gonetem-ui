import type cytoscape from "cytoscape";

export interface TopologyRect {
  position: { x: number; y: number };
  w: number;
  h: number;
}

export type TopologyRectMap = { [id: string]: TopologyRect };

const RECT_ID_PREFIX = "rect-";

export const DEFAULT_RECT_SIZE = { w: 200, h: 120 };
export const MIN_RECT_SIZE = { w: 40, h: 30 };

const isPlainObject = (value: unknown): value is { [key: string]: unknown } =>
  typeof value == "object" && value != null && !Array.isArray(value);

const isValidPosition = (value: unknown): value is { x: number; y: number } =>
  isPlainObject(value) &&
  typeof value.x == "number" && isFinite(value.x) &&
  typeof value.y == "number" && isFinite(value.y);

const isValidExtent = (value: unknown): value is number =>
  typeof value == "number" && isFinite(value) && value > 0;

export function parseTopologyRects(topo: unknown): TopologyRectMap {
  const rects: TopologyRectMap = {};
  if (!isPlainObject(topo)) return rects;

  const nodeNames = new Set(
    isPlainObject(topo.nodes) ? Object.keys(topo.nodes) : []
  );

  const ui = topo.ui;
  if (!isPlainObject(ui)) return rects;

  const rawRects = ui.rects;
  if (!isPlainObject(rawRects)) return rects;

  Object.keys(rawRects).forEach((id) => {
    if (nodeNames.has(id)) return;

    const entry = rawRects[id];
    if (!isPlainObject(entry)) return;
    if (!isValidPosition(entry.position)) return;
    if (!isValidExtent(entry.w)) return;
    if (!isValidExtent(entry.h)) return;

    rects[id] = {
      position: { x: entry.position.x, y: entry.position.y },
      w: entry.w,
      h: entry.h,
    };
  });

  return rects;
}

export function nextRectId(existingKeys: Iterable<string>): string {
  const keys = new Set(existingKeys);

  let seed = 0;
  keys.forEach((key) => {
    if (!key.startsWith(RECT_ID_PREFIX)) return;
    const num = Number(key.slice(RECT_ID_PREFIX.length));
    if (isFinite(num) && num >= seed) seed = num + 1;
  });

  let id = `${RECT_ID_PREFIX}${seed}`;
  while (keys.has(id)) {
    seed += 1;
    id = `${RECT_ID_PREFIX}${seed}`;
  }
  return id;
}

export function serializeRects(
  entries: readonly {
    id: string;
    position: { x: number; y: number };
    w: number;
    h: number;
  }[]
): TopologyRectMap {
  const rects: TopologyRectMap = {};
  entries.forEach((entry) => {
    rects[entry.id] = {
      position: { x: entry.position.x, y: entry.position.y },
      w: entry.w,
      h: entry.h,
    };
  });
  return rects;
}

export function createRect(
  cy: cytoscape.Core,
  position: { x: number; y: number }
): string {
  const id = nextRectId(cy.elements().map((el) => el.id()));
  cy.add({
    group: "nodes",
    data: { id, w: DEFAULT_RECT_SIZE.w, h: DEFAULT_RECT_SIZE.h },
    position: { ...position },
    classes: "rect",
  });
  return id;
}

export function mergeRectsIntoTopology(
  topo: { ui?: unknown },
  rects: TopologyRectMap
): void {
  if (Object.keys(rects).length == 0) {
    if (!isPlainObject(topo.ui)) {
      delete topo.ui;
      return;
    }

    const { rects: _rects, ...restUi } = topo.ui;
    if (Object.keys(restUi).length == 0)
      delete topo.ui;
    else
      topo.ui = restUi;
    return;
  }

  topo.ui = {
    ...(isPlainObject(topo.ui) ? topo.ui : {}),
    rects,
  };
}
