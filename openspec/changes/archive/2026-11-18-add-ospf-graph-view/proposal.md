# Proposal

## Why

The project panel already has an OSPF view tab that switches the view state, but selecting it renders nothing: `ProjectOspfGraph.tsx` is an empty stub and `ProjectPanel.tsx` has no render branch for the OSPF view. The gonetem console TUI offers an OSPF area view (`ospf` command) that visualizes a router's link-state database; the GUI needs the equivalent so users can see OSPF adjacencies, transit/stub networks, and link costs without leaving the app.

## What Changes

- Complete `ProjectOspfGraph`: render an OSPF link-state graph for a selected router with cytoscape (the library already used by `ProjectTopoGraph`), fetched from the node via two one-shot execs (`vtysh -c "show ip ospf database router|network json"`).
- Port the gonetem console's `buildOspfGraph` rules to TypeScript: router/transit/stub vertices keyed by router-id and subnet prefix, merged areas, p2p edge dedup with one-sided-view handling, stub second-pass typing, /32 stub hiding, and the queried router as layout root.
- Add a bottom tab navigation to select the router: one tab per topology node of type `docker.router*` or `docker.vyos` (intentionally broader than the Go console, which only accepts `docker.router*`; VyOS also runs FRR).
- Style vertices as rectangles colored by type (router / transit network / stub network) with a visible color legend; edges labeled with costs and point-to-point interface addresses.
- Render the OSPF view branch in `ProjectPanel` when the view is `"ospf"` (tab already exists and is disabled unless the project is running).
- Fetch on router-tab selection plus a manual refresh action; no automatic polling.

## Capabilities

### New Capabilities

- `ospf-graph`: Visualizing a router's OSPF link-state database as a cytoscape graph — LSDB fetch, graph construction rules, router selection tabs, vertex/edge rendering, color legend, and error/no-data handling.

### Modified Capabilities

None. The OSPF view tab and its running-gating already exist in the project workspace; this change fills in the view's content without changing existing requirements.

## Impact

- `src/components/ProjectOspfGraph.tsx` (completed), `src/components/ProjectPanel.tsx` (ospf view render branch).
- New pure module for LSDB-to-graph construction plus unit tests; new localization keys (en/fr) for role names and errors.
- No new dependencies: cytoscape and cytoscape-fcose are already installed, and the built-in `breadthfirst` layout roots the view (cytoscape-dagre deliberately not added in v1).
- Reuses the existing `window.api.runNodeExecOnce` IPC path; no proto/main-process/preload changes.
