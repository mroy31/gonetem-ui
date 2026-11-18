# Design

## Context

The topology graph is a single Cytoscape.js instance inside `ProjectTopoGraph.tsx`. Free-floating text labels already implement the full lifecycle this change needs for rectangles: pure serialization module (`topologyLabels.ts`) writing into the network file's top-level `ui` section, a `.label` node class with its own stylesheet entry, exclusion from layouts and node-position saves via `.not(".label")`, and context-menu/modal wiring gated on `features.topologyWrite`. See proposal.md - Why for motivation; the specs for observable behavior.

Two constraints found in the existing code shape the approach:

- `updateElements()` (ProjectTopoGraph.tsx) removes every graph element whose id is absent from the file-derived element list, and it re-runs on every `prjStatus`/`topology` change (project state polling while running). Anything modeled as a graph element but not in the file gets silently destroyed mid-interaction.
- Cytoscape has no resize handles, and node drag moves the node center only.

## Goals / Non-Goals

**Goals:**
- Rectangles are graph elements for rendering (so PNG export and fit come free), but their editing affordances live outside the graph element model.
- Clone the labels architecture so both decorations share one mental model and one set of exclusion rules.

**Non-Goals:**
- No membership/grouping semantics (moving a rect never drags enclosed nodes); no drag-to-draw creation gesture (future layer, not this change); no text inside rectangles; no per-rect styling options.

## Decisions

### Rectangles are Cytoscape nodes with a `.rect` class
`getElements()` gains a third pass (after nodes/edges/labels) pushing `{group:"nodes", classes:"rect", data:{id, w, h}}` with `position` = stored center. Stylesheet entry: `background-opacity: 0`, `border-style: dotted`, `border-width: 1`, `width/height: data(w)/data(h)`, low `z-index` so nodes and labels paint on top. Alternative considered: render rects as DOM divs overlaying the canvas — rejected because `cy.png()` only renders canvas content, so exported images would miss rectangles (a spec requirement).

### Resize handles are DOM divs, not graph elements
While a rect is selected, absolutely-positioned corner divs are rendered inside the graph container (wrapped in a `position: relative` parent), positioned via `cy.nodes().positions()` transformed by the current zoom/pan, resynced on `pan zoom render` events and the existing `ResizeObserver`. Screen-pixel deltas are divided by zoom to update `data(w)`, `data(h)`, and center `position` live, pinning the opposite corner; a minimum size (≈40x30) is clamped. Rejected alternative: handle nodes inside cytoscape — they would be destroyed by `updateElements()` on any state tick mid-resize, would leak into `saveNodePositions`' node-position bucket, and would need suppression in exports.

### `topologyRects.ts` mirrors `topologyLabels.ts` one-for-one
Pure module: `parseTopologyRects` (validates plain-object shape, finite numbers, skips keys colliding with node names), `nextRectId` (`rect-` + max-suffix scan, collision-avoiding), `serializeRects`, `mergeRectsIntoTopology` (sets `ui.rects`; prunes empty map/`ui` exactly like `mergeLabelsIntoTopology`). File shape: `ui.rects.<id> = { position: {x, y}, w, h }` with position = center, matching cytoscape's node anchor so no conversion layer is needed. Alternative: top-left + size — rejected as it adds a transform everywhere and center reads fine in hand-edited YAML.

### One shared decoration selector
The three `.not(".label")` call sites (`applyLayout`, auto initial layout, `saveNodePositions`) become a shared constant (e.g. `DECORATION_SELECTOR = ".label, .rect"`) exported from a common module, so future decorations change one line instead of three and none is missed.

### Creation and deletion reuse the label menu plumbing
`LabelContextMenu` gains rectangle modes: the canvas menu (already "add label") gains an "Add rectangle" entry; a new `rect` menu mode offers delete on rect right-click, mirroring the existing `label` mode branch in the `cxttap` handler. No modal is introduced; `dbltap` is deliberately not wired for `.rect`. Student edition gets neither entry because the whole block stays inside the existing `features.topologyWrite` gate.

### Default and minimum sizes are code constants
Default 200x120, minimum 40x30 model units, as named constants in `topologyRects.ts`. Spec leaves exact numbers open; changing them later changes no behavior contract.

## Risks / Trade-offs

- [Rect interior captures pointer events: canvas panning is impossible from inside a rect] → Accepted with the user during exploration; nodes/edges still win on overlap (z-ordered hit-testing), and pan works everywhere else. Document in release notes.
- [Handle sync can lag if a pan/zoom event is missed] → Re-derive from model coords on every `render` event rather than incremental deltas; handles clip via container `overflow: hidden` when the rect scrolls away; a `blur`/`deselect` event removes handles, so stale handles can't persist.
- [`updateElements()` re-adds rects from file and could fight unsaved edits] → It only calls `.data()`/`removeClass`/`addClass` on existing elements, never `position()`, matching the behavior labels already rely on.
- [Serialized center+w/h can drift out of sync with rendered size after zoom-heavy sessions] → Save reads `data(w)/data(h)`/`position()` directly (the same values handles mutate), so no derived geometry exists to drift.

## Migration Plan

Additive file-format change only: files lacking `ui.rects` render exactly as before; opening a file with `ui.rects` in an older UI version is inert (unknown `ui` keys are ignored by existing parse paths). Rollback = revert the UI change; files keep harmless `ui.rects` entries.
