# Tasks

## 1. Baseline

- [x] 1.1 Record a green baseline: run `yarn test` and `yarn typecheck`; both must pass before any move. If either fails at baseline, stop and report (do not proceed with a broken tree).

## 2. Move leaf folders (no cross-folder consumers yet)

- [x] 2.1 `git mv` ProgressServerPull.tsx -> `src/components/server/`; fix its `../proto` -> `../../proto` imports; verify `yarn typecheck` passes.
- [x] 2.2 `git mv` ConfigurationViewerPanel.tsx -> `src/components/config-viewer/`; fix depth imports (`../proto`, `../context`, etc. -> `../../`); verify `yarn typecheck`.
- [x] 2.3 `git mv` ConsolePanel.tsx -> `src/components/consoles/`; fix depth imports; verify `yarn typecheck`.
- [x] 2.4 `git mv` TopologyEditorPanel.tsx -> `src/components/editor/`; fix depth imports and its `./ProjectPanel` -> `../project/ProjectPanel` (forward reference, resolved in 3.1); verify `yarn typecheck` after 3.1.
- [x] 2.5 `git mv` ProjectOspfGraph.tsx, ProjectOspfGraph.test.tsx, ospfGraph.ts, ospfGraph.test.ts -> `src/components/ospf-graph/`; fix depth imports and the fixtures path (`./__fixtures__` -> `../__fixtures__`); verify `yarn vitest run src/components/ospf-graph`.

## 3. Move shell and project folders

- [x] 3.1 `git mv` MsgToast.tsx, OptionsModal.tsx, OptionsModal.test.tsx -> `src/components/shell/`; fix depth imports; update `src/app.tsx` imports for these three; verify `yarn typecheck`.
- [x] 3.2 `git mv` ProjectPanel.tsx, ProjectPanel.test.tsx, ProjectToolbar.tsx, ProjectContextPanel.tsx, ProjectContextPanel.test.tsx, ProjectListModal.tsx, ProgressProjectSave.tsx, ProgressProjectClose.tsx -> `src/components/project/`; fix same-folder `./X` imports (unchanged), cross-folder imports to `../ospf-graph/...`, `../topo-graph/...`, `../editor/...`, `../consoles/...`, `../config-viewer/...`, and depth `../` -> `../../`; verify `yarn typecheck`.
- [x] 3.3 Update remaining `src/app.tsx` imports (ProjectPanel, ProjectListModal, ProgressProjectSave, ProgressProjectClose, ProgressServerPull, ProgressTopologyRun, NodeMessagesToast) to their new `./components/<folder>/` paths; verify `yarn typecheck` and `yarn lint`.

## 4. Move topo-graph folder

- [x] 4.1 `git mv` ProjectTopoGraph.tsx, ProjectTopoGraphContainer.tsx, ProjectTopoGraphToolbar.tsx, ProjectTopoGraphToolbar.test.tsx, RectResizeHandles.tsx, RectResizeHandles.test.tsx, NodeContextMenu.tsx, DecorationContextMenu.tsx, DecorationContextMenu.test.tsx, LabelTextModal.tsx, LabelTextModal.test.tsx, NodeMessagesToast.tsx, ProgressTopologyRun.tsx, topologyLabels.ts, topologyLabels.test.ts, topologyLayout.ts, topologyLayout.test.ts, topologyRects.ts, topologyRects.test.ts, projectTopoGraphLabels.test.ts, projectTopoGraphRects.test.ts -> `src/components/topo-graph/` (ProjectTopoGraph.tsx content untouched beyond imports); fix depth imports and `../project/ProjectPanel` references; verify `yarn vitest run src/components/topo-graph`.

## 5. Full verification

- [x] 5.1 Run `yarn test` (all suites green) and `yarn typecheck` and `yarn lint` and `yarn format:check` — the full gate.
- [x] 5.2 Sanity the diff is rename-dominated: `git diff --stat -M --cached` (or `git status`) shows moves detected as renames; spot-check `git log --follow` works for `ProjectTopoGraph.tsx`; confirm `src/components` root contains only the 8 subfolders plus `__fixtures__` and nothing else.
