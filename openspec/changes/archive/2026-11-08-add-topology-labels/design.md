# Design

## Context

See proposal.md - Why. The topology graph is a cytoscape instance inside `ProjectGraph.tsx`, built from `getElements(topo, prjStatus)` and kept in sync on topology-text changes by `updateElements`, which removes any element whose id is absent from the freshly derived definitions. Persistence today: the toolbar save action calls `ProjectPanel.saveTopologyHandle` -> `ProjectGraph.saveNodePositions`, which does `YAML.parse` on the raw file text, merges `cy.nodes()` positions into `topo.nodes[*].ui.position`, then `YAML.stringify` + `writeTopologyFile`, and finally re-reads the file to refresh graph and YAML editor. Node-level `ui:` data (`icon`, `position`) already round-trips this way, and the server tolerates it; the project owner confirmed the server will also tolerate a top-level `ui:` section.

## Goals / Non-Goals

**Goals:**
- Labels behave like first-class canvas objects: pan/zoom, drag, and PNG export work without extra machinery.
- A single persistence path, the existing save action — no new save/dirty concepts.
- The YAML file stays the single source of truth: hand-edits of `ui.labels` reflect in the graph through the existing `updateElements` sync.

**Non-Goals:**
- No label styling options (color, font, background) in this change — one fixed style.
- No attachment of labels to nodes/links, no multi-line rich text editing.
- No server-side (gonetem) changes; the server ignores the `ui:` section.
- No comment/formatting preservation for the YAML round-trip (already lost today by parse/stringify).

## Decisions

### D1: Labels are classed cytoscape nodes, not a DOM overlay
Render labels as cytoscape nodes with a dedicated `label` class: no `image`, transparent background, style `label: data(name)`. Dragging, panning, zooming, selection, and `cy.png()` export come for free — the existing "Record topology image" requirement is the tie-breaker, since a DOM overlay (`cy.png()` renders only cytoscape internals) would silently drop labels from exports. Alternative considered: absolutely-positioned HTML divs resynced on viewport events — nicer text editing, rejected for the export gap and resync complexity.

Consequences accepted: labels live in one id namespace with nodes and edges (handled in D3), and every graph-wide operation must exclude them (D5).

### D2: Persistence rides the existing save path
Extend `saveNodePositions` to also collect `cy.nodes(".label")` (text + position) and write them to `topo.ui.labels` before stringifying; delete the `ui` section entirely when no labels exist so untouched files stay byte-identical in spirit. `YAML.parse`/`stringify` of the whole document already preserves unknown top-level keys, so `ui.labels` survives node-position saves and vice versa. `updateElements` needs no special case if `getElements` emits label definitions from the parsed `ui.labels` map — unsaved changes vanish on the next rebuild-from-file, which is exactly the specified ephemeral behavior.

### D3: Generated `lbl-` ids with a load-time collision guard
Label keys are generated (`lbl-1`, `lbl-2`, ... via a counter seeded from existing keys), never user-visible, stable across text edits and moves. `lbl-` prefix makes collisions with real node names unlikely but not impossible, so at load time any labels-map entry whose key equals a node name is dropped from rendering. Generated ids also keep cytoscape element ids distinct for hand-written content that dodges the collision rule.

### D4: Interaction wiring
- Add: canvas-level `cxttap` filtered to the core target (empty canvas — today's `cxttap` binding is scoped to `"node"`), opening a small menu with an add-label entry; the confirm dialog is a controlled React modal with one text field, following `OptionsModal.tsx` patterns, prefilled/empty per add vs edit.
- Edit/delete: `dbltap` on `.label` opens the same modal prefilled (empty confirmation deletes); right-click on `.label` reuses the context-menu placement pattern of `NodeContextMenu`, rendered from the same `contextMenu` state shape.
- New visible strings go through react-i18next like every other component.
- Labels are created/edited only client-side until save; the modal never writes the file directly.

### D5: Exempt labels from graph-wide operations
- Layouts: build the layout collection from `cy.elements().not(".label")` (toolbar `applyLayout`) so nodes rearrange and labels stay.
- `hasSavedPositions` keeps checking only node `ui.position` — labels alone must not suppress the automatic initial layout.
- `fit()` stays on all elements so labels remain reachable.
- Existing `saveNodePositions` iterates `cy.nodes()` for positions: restrict that loop to non-label nodes so labels never leak into `topo.nodes`.

## Risks / Trade-offs

- [Server rejects a top-level `ui:` section in practice despite the owner's expectation] → Verified resolved: live-server spike (open, read-back, check, run) all succeeded with a top-level `ui.labels` section; the server's YAML parsing is non-strict and file RPCs round-trip raw bytes.
- [Server-side `SynchroniseTopology` (link add/del/update with sync) rewrites the network file from typed structs, wiping any `ui:` data] → Pre-existing behavior: it already destroys node-level `ui.position`/`ui.icon` today; labels inherit the same known trade-off. Out of scope to fix here (would require a gonetem backend change).
- [`updateElements` sweep deleting unsaved labels on every state refresh] → state refreshes rebuild from file text by design; acceptable and specified as ephemeral-until-saved. Unsaved label edits lost on refresh are also specified behavior.
- [Hand-edited YAML with malformed `ui` shape crashes graph render] → render path treats a non-map `ui` or non-object entries defensively (skip them), reusing the existing try/catch error banner in `ProjectGraph`.
- [`cy.elements().not(".label")` misses a future graph-wide operation] → add a brief comment at the style definition noting the invariant: `.label` nodes are annotations, excluded from layouts/position-saves.
- [PNG export renders label text with the default node text style] → tune `label` class style (font size, wrap via `text-wrap: wrap`, `text-max-width`, padding via `shape: round-rectangle` with light background) and verify once in an exported image.

## Migration Plan

Purely additive: files without a `ui` section behave exactly as before; files saved by the new UI open unchanged on older UI versions (unknown top-level key ignored by the server, older renderer ignores it too). Rollback = revert the UI change; stray `ui:` sections in files remain harmless.
