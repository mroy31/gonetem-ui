# Proposal

## Why

When a topology file contains no saved node positions (`ui.position`), the graph renders with every node stacked at the origin, because the renderer always applies the `preset` layout and `preset` has nothing to place. Users must drag every node by hand before the topology becomes readable. There is also no way to automatically arrange an existing topology.

## What Changes

- On graph creation, if no node in the topology has a saved position, automatically run a force-directed layout (fcose) and fit the view instead of rendering the stack at the origin.
- Add a "Layout" action menu to the topology graph toolbar offering Force (fcose), Grid, Concentric, and Hierarchical (breadthfirst); selecting an entry re-runs that layout on the whole graph and fits the view.
- Layout results stay in memory: the existing Save button remains the only path that writes positions into the topology file. No new persistence, no preferences.
- Add the `cytoscape-fcose` extension dependency (v2.2.x, MIT, peer `cytoscape ^3.2.0`) plus a minimal ambient type declaration, since the package ships none.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `topology-definition`: adds requirements for automatic initial graph layout when no saved positions exist, and for a user-selectable graph layout menu. Existing position-persistence behavior is unchanged.

## Impact

- `src/components/ProjectGraph.tsx`: layout selection on creation and via imperative handle; fcose registration with cytoscape.
- `src/components/ProjectGraphToolbar.tsx`: new layout dropdown control.
- `package.json` / `yarn.lock`: new dependency `cytoscape-fcose@^2.2.0`.
- `types/`: small ambient module declaration for `cytoscape-fcose` (package ships no types).
- `app/localization/locales/*`: new i18n keys for the layout menu labels.
- No new IPC channels: the feature is entirely renderer-side.
