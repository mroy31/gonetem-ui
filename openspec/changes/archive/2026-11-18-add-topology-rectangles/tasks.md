# Tasks

## 1. Pure rectangles module

- [x] 1.1 Create `src/components/topologyRects.ts` with `parseTopologyRects`, `nextRectId` (`rect-` prefix), `serializeRects`, `mergeRectsIntoTopology`, plus default (200x120) and minimum (40x30) size constants, mirroring `topologyLabels.ts` conventions, and verify with `src/components/topologyRects.test.ts` (node vitest project: valid parse, malformed entries skipped, node-name key collisions skipped, id generation/stability, merge prunes empty `ui.rects`/`ui` without touching sibling keys)
- [x] 1.2 Run `yarn lint` and `yarn typecheck` and fix any issues from the new module

## 2. Graph rendering and persistence plumbing

- [x] 2.1 Add the `.rect` stylesheet entry to `cyStyle` in `ProjectTopoGraph.tsx` (transparent fill, 1px dotted border, `width/height: data(w)/data(h)`, low z-index) and a `rect` entry to `ALL_CLASSES`, and verify visually via `yarn start` that a hand-added `ui.rects` map in a project file renders as a dotted empty box behind nodes
- [x] 2.2 Extend `getElements()` to push `.rect` node elements from `parseTopologyRects` (center position, `w`/`h` in data) and verify with a `projectTopoGraphRects.test.ts`-style test covering load, collision-skip, and files without `ui.rects` rendering unchanged
- [x] 2.3 Introduce a shared decoration selector (e.g. `DECORATION_SELECTOR = ".label, .rect"`) and replace the three `.not(".label")` sites (`applyLayout`, auto initial layout, `saveNodePositions` positions bucket), and verify existing label layout/save tests still pass plus new tests assert rects are excluded from node positions and untouched by layout calls
- [x] 2.4 Extend `saveNodePositions` to collect `.rect` elements (id, center, `data(w)`, `data(h)`) and `mergeRectsIntoTopology` into the saved YAML, and verify by test that saving writes `ui.rects` with stable `rect-` ids, preserves labels/node data, and removes entries of deleted rects

## 3. Create, delete, and edition gating

- [x] 3.1 Add the "Add rectangle" entry to the canvas right-click menu and a `rect` delete mode to `LabelContextMenu` (or sibling component), wired in the `cxttap` handler inside the existing `features.topologyWrite` gate; creation adds a default-size rect at `pendingLabelPositionRef` with no modal, and `dbltap` stays unwired for `.rect`, and verify by extending `LabelContextMenu.test.tsx` plus a graph-level test (create at position, delete removes, no entries when `topologyWrite` is off)
- [x] 3.2 Add the new menu translation keys to `app/localization/locales/en/translation.json` and `app/localization/locales/fr/translation.json`, and verify both locales resolve the keys in the menu tests

## 4. Resize handle overlay

- [x] 4.1 Wrap the graph container in a `position: relative` parent and render four corner handle divs while exactly one `.rect` is selected, positioned from model coords via current zoom/pan, resynced on `pan`/`zoom`/`render` events and the existing ResizeObserver, and removed on deselect/blur, and verify by test (jsdom) that selection shows handles and deselection removes them
- [x] 4.2 Implement corner-drag resize: convert screen delta by `/zoom`, pin the opposite corner, update `position` and `data(w)/data(h)` live, clamp at the minimum size, and verify by test that a simulated corner drag produces the expected geometry and the clamp holds
- [x] 4.3 Keep handles out of exports and persistence (they are DOM, not graph elements) and verify `exportImage` output is unaffected by visible handles via the existing export path test or a focused assertion

## 5. Integration verification

- [x] 5.1 Run `yarn lint`, `yarn typecheck`, and `yarn test` with everything green
- [x] 5.2 Manually verify end-to-end via `yarn start`: create via canvas right-click, drag-move, resize all four corners, delete via rect menu, save then reopen the project (geometry and `rect-` ids survive), layout leaves rects in place, fit and PNG export include rects, node dragging over a rect still moves only the node, and a student build shows no add/delete entries and renders stored rects
