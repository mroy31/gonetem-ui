# Proposal

## Why

`src/components/` is a flat directory of 41 files mixing panels, modals, toasts, context menus, graphs, and pure logic modules. The clutter makes it hard to locate a feature's code and keeps diffs for one spec scattered across the folder. The file names cluster along the same boundaries as the project's existing capability specs, so grouping them by feature costs nothing and pays off immediately.

## What Changes

- Reorganize `src/components/` into feature-based subfolders: `shell/`, `project/`, `topo-graph/`, `ospf-graph/`, `editor/`, `consoles/`, `config-viewer/`, `server/`.
- Move-only change: exports, props, and logic are untouched; the only content edits are import-path rewrites. `ProjectTopoGraph.tsx` moves as-is (no split).
- Shared test fixtures stay at `src/components/__fixtures__/`.
- All import paths (source and test files) updated to the new locations.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. This is a pure structural refactor: no spec-level behavior changes. `skip_specs: true` is set in `.openspec.yaml`.

## Impact

- `src/components/**` — every non-fixture file moves to a subfolder.
- `src/app.tsx` — 9 component imports rewritten to `./components/shell/...` and `./components/<feature>/...`.
- Cross-imports inside components (ProjectPanel tree, container/graph pairs, tests importing helpers like `ospfGraph.ts`, `topologyRects.ts`, `ProjectTopoGraph`) rewritten to relative paths within/across subfolders.
- No runtime, API, or dependency changes. Vitest suite is the verification gate.
