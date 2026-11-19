# Design

## Context

`src/components/` holds 41 entries flat. The verified import graph has two roots: `app.tsx` (9 app-level components) and `ProjectPanel` (panels, graphs, toolbar). Most sibling imports are feature-internal; only a handful cross features. Vitest discovers tests via `src/**/*.test.ts(x)` globs, so test location within `src/` is free. No build, lint, or TS config references `src/components/` paths; only `app.tsx` imports from outside the folder. See proposal.md - Why for motivation.

## Goals / Non-Goals

**Goals:**
- Every feature's files live in one folder mirroring the spec boundaries.
- `git diff` shows pure renames plus import-line edits; reviewers can verify with `git show --stat -M`.
- Full vitest suite passes with zero test code changes beyond import paths.

**Non-Goals:**
- Splitting `ProjectTopoGraph.tsx` or any other component.
- Changing component APIs, exports, or the dependency graph between components.
- Adding barrel `index.ts` re-export files.
- Moving `__fixtures__` or anything outside `src/components/`.

## Decisions

**D1: Feature-based folders, not type-based.** Folders mirror capability specs so a spec change touches one folder. Alternative (`panels/`, `modals/`, `toasts/`) scatters one feature's files across folders; rejected.

**D2: Placement by owning feature, not by importer.** The four progress overlays and `ProjectListModal` move with their features even though `app.tsx` imports them. Alternative (all `app.tsx` imports go to `shell/`) is mechanically simpler but breaks D1's promise the first time a progress dialog is edited; rejected.

**D3: Folder assignments.**

| Folder | Files |
|---|---|
| `shell/` | MsgToast, OptionsModal (+test) |
| `project/` | ProjectPanel (+test), ProjectToolbar, ProjectContextPanel (+test), ProjectListModal, ProgressProjectSave, ProgressProjectClose |
| `topo-graph/` | ProjectTopoGraph, ProjectTopoGraphContainer, ProjectTopoGraphToolbar (+test), RectResizeHandles (+test), NodeContextMenu, DecorationContextMenu (+test), LabelTextModal (+test), NodeMessagesToast, ProgressTopologyRun, topologyLabels/Layout/Rects (+tests), projectTopoGraphLabels.test, projectTopoGraphRects.test |
| `ospf-graph/` | ProjectOspfGraph (+test), ospfGraph (+test) |
| `editor/` | TopologyEditorPanel |
| `consoles/` | ConsolePanel |
| `config-viewer/` | ConfigurationViewerPanel |
| `server/` | ProgressServerPull |

**D4: `NodeMessagesToast` goes to `topo-graph/`, not `shell/`.** `ProgressTopologyRun` imports `INodeMessages` from it; they are the same topology-run/lifecycle surface and move together. An earlier sketch placed it in `shell/`, which would create an avoidable `topo-graph -> shell` import of a shared type; superseded.

**D5: `server/` is a single-file folder.** Placeholder for the server-image-pull feature; keeps D2 consistent. Alternative (leave in `shell/`) rejected for the same reason as D2.

**D6: `__fixtures__` stays at `src/components/__fixtures__/`.** Only `ospfGraph.test.ts` imports it today; after its move it references `../__fixtures__/...`. Keeping the fixture location minimizes churn if the topo-graph tests adopt fixtures later.

**D7: Mechanics - `git mv` then import rewrites.** Per-folder `git mv` batches, then rewrite import specifiers: same-folder `./X` unchanged; cross-feature `./X` becomes `../<folder>/X`; app.tsx uses `./components/<folder>/X`. Files moved one level deeper need `../` -> `../../` for `src/`-level imports (`../proto`, `../context`, `../i18n`, ...). Fixtures and same-folder tests need no edit.

## Risks / Trade-offs

- [Depth edit misses a `../` import, caught only at runtime] -> `tsc --noEmit` (or build) and full vitest run gate completion; every moved file is import-checked.
- [Git shows edits instead of renames] -> keep moves and import edits in one commit per folder but use `git mv`; similarity index stays above rename threshold since only import lines change.
- [`ProjectTopoGraph.tsx` (21KB) as the gravity center of `topo-graph/`] -> accepted; splitting is explicitly a future change.
- [Deep folder paths lengthen relative imports] -> accepted; no barrel files to hide structure.

## Migration Plan

Ordered by dependency-free leaf folders first (server, config-viewer, consoles, editor, ospf-graph, shell, topo-graph, project). Rollback: revert the single reorg commit; nothing else touches these files while the change is in flight.
