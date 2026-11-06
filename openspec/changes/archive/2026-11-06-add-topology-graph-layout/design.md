# Design

## Context

See proposal.md - Why. The renderer builds cytoscape elements with `position: nodeAttr?.ui?.position` (ProjectGraph.tsx `getElements`) and always creates the graph with `layout: { name: "preset" }`, so unpositioned nodes land at (0,0). Positions only ever enter the YAML through `saveNodePositions` behind the toolbar Save button. The toolbar (ProjectGraphToolbar.tsx) already receives imperative handles for `fit` and save; the graph exposes them through `ProjectGrahHandle`.

## Goals / Non-Goals

**Goals:**
- A topology with zero saved positions never opens as an overlapping pile at the origin.
- One obvious place to re-arrange an existing topology on demand.
- Zero changes to the persistence model: Save stays the only writer of `ui.position`.

**Non-Goals:**
- Smart placement for individually added nodes in an already-positioned graph (parked; the layout menu is the workaround).
- Remembering the chosen layout as a preference or per topology; the positions themselves are the memory.
- Live/animated re-layout while dragging, or layouts beyond the four offered.

## Decisions

- **Register fcose once at renderer module scope**: `cytoscape.use(cytoscapeFcose)` in the ProjectGraph module (not the main process, not lazily). The extension pattern is the documented one and webpack bundles it routinely.
- **Auto-layout is a creation-time decision, not a render-time one**: when the graph instance is created, scan the parsed topology for any `ui.position` on any node. None found → create the graph with the fcose layout; otherwise keep `preset`. Because topology edits go through `updateElements` (which never re-runs layouts and never resets existing node positions), the auto-layout cannot "dance" on state updates. A graph for a project is created once per mount.
- **Layout menu is an action, invoked through the existing handle pattern**: add `applyLayout(kind)` to `ProjectGrahHandle`; the toolbar dropdown calls it. Each kind maps to a cytoscape layout (`fcose`, `grid`, `concentric`, `breadthfirst`) run via `cy.layout(opts).run()` over `cy.elements()`, with `cy.fit()` on the layout `stop` event because asynchronous layouts finish after the call returns. No persistent selection state in the dropdown.
- **`fit` after every layout**: fcose in particular can emit coordinates far outside the current viewport; fitting makes the result immediately visible.
- **Type situation**: `cytoscape-fcose` ships no types. Add `declare module "cytoscape-fcose"` under `types/` (already ambient via tsconfig `include`). If the installed cytoscape typings restrict the layout `name` union, pass options through a cast rather than forking the typings.
- **i18n**: new keys for the menu title and the four entries, added to every locale file under `app/localization/locales`, following existing flat key naming (`Fit`, `Save`, ...).

**Alternatives considered**: zero-dependency layouts only (rejected: force-directed is the one users actually want for mesh topologies; core layouts remain in the menu anyway); running fcose on every load when positions are absent-but-then-edited (rejected: run-to-run variation reads as instability; one-shot at creation is deterministic from the user's point of view); persisting auto-layout results automatically (rejected: would silently rewrite the YAML of files the user never asked to change).

## Risks / Trade-offs

- [fcose is slower/iterative on very large graphs] → layouts run once, on user action or first open; if a graph becomes sluggish, `animate: false` (or `nodeRepulsion`/`idealEdgeLength` tuning) is a local knob, no design change.
- [Auto-layout fires only when *no* position exists, so one stray `ui.position` in a file suppresses it and the remaining nodes still stack at origin] → accepted for v1; the layout menu covers it, and the "Partial positions keep saved placement" scenario documents the behavior.
- [`cytoscape.use` must run before any graph creation] → registration lives in the same module that creates graphs, import order guarantees it.
- [Freeze history: AGENT.md warns against dependency changes] → fcose is additive with an `^3.2.0` peer range satisfied by cytoscape 3.34.4; it does not touch the pinned packages (protobuf, TypeScript, Tailwind, asset-relocator).
