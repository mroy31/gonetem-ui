# Proposal

## Why

The topology graph is rendered with a locally patched fork of vis-network 9.1.9 (`"vis-network": "link:./../vis-network-9.1.9"`), whose only modification adds per-endpoint edge labels (`labelFrom`/`labelTo`). This fork lives outside the repository, so any clean checkout fails to build, and the patch will never be accepted upstream — staying on vis-network means keeping the fork forever. Cytoscape.js is actively maintained and covers the forked feature natively with `source-label`/`target-label`, making it the only exit that removes the fork without losing functionality.

## What Changes

- Replace the graph rendering library: remove `vis-network` (local fork link), `vis-data`, and `vis-util` dependencies; add `cytoscape` and `@types/cytoscape`.
- Rewrite `src/components/ProjectGraph.tsx` internals on Cytoscape.js at behavioral parity:
  - node icons per type/state via `background-image` (with `background-shape: circle` for the router icon's former `circularImage`)
  - interface index labels at each edge endpoint via `source-label`/`target-label`
  - edge coloring by interface up/down state
  - manual layout only (physics off), node positions persisted to the topology YAML as today
  - right-click context menu on nodes, edge selection callbacks, pan/zoom, fit-to-view
  - PNG export of the rendered graph (same imperative handle contract, so `ProjectPanel`, `ProjectGraphToolbar`, and `NodeContextMenu` are untouched)
- Fix intrinsic size on `img/switch.svg` and `img/switch-running.svg` (they declare `width="100%"`/`height="100%"` and one stray duplicate `width` attribute, which breaks Cytoscape's SVG rasterization).
- Swap the two `vi.mock("vis-network", ...)` test mocks for cytoscape equivalents.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. All externally observable graph behaviors — persisting graph layout, recording the topology image (`topology-definition`), the node context menu actions (`node-management`), and edge selection feedback — are unchanged; this is an implementation-level library swap. This change therefore sets `skip_specs: true` in `.openspec.yaml`.

## Impact

- **Code**: `src/components/ProjectGraph.tsx` (only substantive rewrite); `src/app-shell.test.tsx` and `src/components/ProjectPanel.test.tsx` (mock swaps). `ProjectGrahHandle` (`exportImage`, `fit`, `saveNodePositions`) keeps its contract, so consumers are unaffected.
- **Dependencies**: `package.json` loses `vis-network`, `vis-data`, `vis-util`; gains `cytoscape`, `@types/cytoscape`. The build no longer requires the out-of-repo `../vis-network-9.1.9` directory.
- **Assets**: `img/switch.svg`, `img/switch-running.svg` gain explicit pixel dimensions.
- **Verification**: existing specs `topology-definition` (layout persistence, image export) and `node-management` (context menu) serve as the acceptance checklist; a manual smoke pass on a live topology is warranted since jsdom tests mock the renderer.
