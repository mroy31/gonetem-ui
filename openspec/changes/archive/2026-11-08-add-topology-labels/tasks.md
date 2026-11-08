# Tasks

## 1. Server compatibility check

- [x] 1.1 Against a live gonetem server, add a top-level `ui.labels` section (one entry with text + position) to a scratch project's network file and run topology check and topology run through the existing UI; both must succeed, otherwise stop and reassess before any further task (design.md - Risks)

## 2. Label model helpers

- [x] 2.1 Create `src/components/topologyLabels.ts` with a label map type and a parse helper that reads `ui.labels` from a parsed topology, defensively skipping a non-map `ui`, non-object entries, and entries whose key collides with a node name; add `topologyLabels.test.ts` covering valid parsing, malformed shapes, and the collision skip, and verify with `npm test`
- [x] 2.2 Add id generation (`lbl-` prefix, counter seeded from existing keys) and a serializer turning canvas label data (text + position) into the `ui.labels` map, extend `topologyLabels.test.ts` for seed, stability, and empty results, and verify with `npm test`

## 3. Rendering

- [x] 3.1 Extend the topology types and `getElements` in `src/components/ProjectGraph.tsx` to emit one `.label`-classed cytoscape node per parsed label (id, text, position); verify by running `npm start` on a project whose file defines `ui.labels` and seeing each label rendered with its stored text at its stored position
- [x] 3.2 Add a `.label` style rule to `cyStyle` (draggable text on a light round-rectangle, `text-wrap: wrap`, `text-max-width`, no background image) with a comment noting `.label` nodes are annotations excluded from layouts and position saves; verify by running `npm start` and exporting an image containing a long wrapped label

## 4. Persistence

- [x] 4.1 Extend `saveNodePositions` to write the current `.label` nodes into `topo.ui.labels` via the serializer (omit the top-level `ui` section entirely when no labels exist) and restrict the node-position loop to non-label nodes; verify with a `topologyLabels.test.ts` case for the merge/omit rules plus an in-app save after which the YAML editor shows the expected `ui.labels` content
- [x] 4.2 Verify the file-driven sync and ephemerality: editing or removing `ui.labels` text in the YAML editor updates the graph, and reopening the project without saving shows only the stored labels (run `npm start` and observe)

## 5. Interaction

- [x] 5.1 Create a label text modal (shared for add and edit; prefilled text, confirm with non-empty commits, confirm with empty/whitespace does nothing on add and deletes on edit, cancel no-ops) following `OptionsModal.tsx` patterns; verify with React Testing Library tests in the `OptionsModal.test.tsx` style, run with `npm test`
- [x] 5.2 Add a canvas-level `cxttap` handler for empty-canvas right-clicks (existing `cxttap` is scoped to `"node"`) showing a small context menu with an add-label entry that opens the modal and creates the label at the right-clicked model position; verify in-app: create at click position, cancel adds nothing
- [x] 5.3 Wire `dbltap` on `.label` to open the modal prefilled, updating text in place on confirm and deleting on empty confirm; verify in-app both paths
- [x] 5.4 Show a context menu with a delete entry when right-clicking a `.label` (reuse the `contextMenu` state pattern from `NodeContextMenu`), removing the label on confirm; verify in-app
- [x] 5.5 Add the new UI strings to `app/localization/locales/en/translation.json` and `app/localization/locales/fr/translation.json`; verify the context menu entries and modal render translated text in both languages via the language switch in Options

## 6. Layout and view compliance

- [x] 6.1 Exclude `.label` nodes from the toolbar `applyLayout` collections so nodes rearrange and labels stay put; verify in-app by applying Grid and Force layouts over a graph with labels
- [x] 6.2 Add a regression test in `topologyLayout.test.ts` proving `hasSavedPositions` ignores label-only files so the automatic initial layout still runs; verify with `npm test`
- [x] 6.3 Verify view fit includes labels in-app: place a label far outside the node cluster, trigger fit, and confirm it is visible without manual pan

## 7. Integration

- [x] 7.1 Full pass in the running app: add/edit/move/delete labels, save, confirm the saved file content and that a re-rendered graph matches, export the topology image and confirm visible labels appear at their positions, then reopen without saving to confirm changes vanished; finish with `npm test` and `npm run lint` both clean

## Workflow follow-up

- Archive the change after the project's review requirements are satisfied (openspec-sync-specs will fold `topology-labels` into the main specs).
