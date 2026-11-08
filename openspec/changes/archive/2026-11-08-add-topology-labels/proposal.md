# Proposal

## Why

Users annotating a topology drawing (regions, remarks, bandwidth notes) have nowhere to put free text on the canvas today — the only rendered texts are node names and interface indices, neither of which is user-authored. They need sticky-note style labels that can be placed anywhere on the graph and survive reloads.

## What Changes

- Users can add free-floating text labels to the topology graph by right-clicking empty canvas space, edit them by double-clicking, delete them, and drag them anywhere.
- Label text and position are persisted in a dedicated top-level `ui:` section of the network file (`ui.labels`, keyed by generated `lbl-`-prefixed ids), alongside the existing per-node `ui:` data.
- Labels are saved only when the user clicks the existing "Save positions" action, matching how node positions persist today.
- Labels are rendered inside the cytoscape graph, so they appear in exported topology images and move with pan/zoom; automatic and user-selected layouts never rearrange them.
- The server is expected to tolerate the top-level `ui:` section, as it already tolerates node-level `ui:` (confirmed by the project owner).

## Capabilities

### New Capabilities
- `topology-labels`: Free-floating text labels on the topology graph — creation, editing, deletion, positioning, persistence in the network file `ui:` section, and layout/export behavior.

### Modified Capabilities
- (none — node position persistence, layout application, and image export requirements in `topology-definition` are unchanged; labels extend them without altering existing behavior)

## Impact

- `src/components/ProjectGraph.tsx`: label elements rendered as classed cytoscape nodes, canvas context menu for add/delete, double-click edit, layout filtering, and `saveNodePositions` extended to serialize labels into the `ui:` section.
- `src/components/ProjectPanel.tsx`: existing save action now also persists labels (no new button).
- New modal or dialog for label text entry (existing modal patterns), plus i18n keys for new strings (see `localization` capability).
- Tests in `src/components/` (vitest + testing-library, following `topologyLayout.test.ts` patterns).
- Network file format gains a top-level `ui:` section; server-side parsing is out of scope and presumed tolerant.
