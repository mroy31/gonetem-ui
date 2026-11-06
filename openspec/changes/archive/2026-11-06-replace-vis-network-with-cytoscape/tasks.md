# Tasks

## 1. Dependencies and assets

- [x] 1.1 Add `cytoscape` and `@types/cytoscape` to package.json and verify `yarn install` resolves them (keep vis packages installed for now so the app still builds before the rewrite)
- [x] 1.2 Fix intrinsic sizes in `img/switch.svg` and `img/switch-running.svg` (explicit pixel `width`/`height` consistent with their viewBox aspect; remove the stray duplicate `width` attribute) and verify both files still parse as SVG and render correctly when opened in a browser

## 2. Rewrite ProjectGraph internals on Cytoscape

- [x] 2.1 Create the cytoscape instance in `ProjectGraph.tsx`'s mount effect (container, stylesheet, `wheelSensitivity`-reasonable defaults, pan/zoom enabled) and swap the `vi.mock("vis-network")` stub in `src/app-shell.test.tsx` for a cytoscape stub exposing the methods the component touches; verify `yarn test` passes and `yarn lint` is clean
- [x] 2.2 Render nodes with per-type/per-state SVG icons via `background-image` (`background-shape: circle` for the router icon), explicit node `width`/`height` matching the current app's icon size, and node labels; verify visually with `yarn start` on a project that has running and stopped nodes
- [x] 2.3 Render edges with `source-label`/`target-label` interface indexes and state-driven colors (green up / red down / gray inactive) via edge classes or computed styles, replacing the fork's `labelFrom`/`labelTo`; verify visually that labels appear at both endpoints and colors track interface state after toggling an interface from the node context menu
- [x] 2.4 Wire interactions: `contextmenu` on nodes opens `NodeContextMenu` at the pointer position, left click hides it, edge `select`/`unselect` call `onSelectEdge`; verify by right-clicking a node and selecting/deselecting a link in the running app
- [x] 2.5 Implement the rebuild path for topology/state updates (element regeneration preserving viewport and selection) so live state refreshes do not jump the view; verify by watching a running project refresh while zoomed/panned
- [x] 2.6 Implement the `ProjectGrahHandle` contract on cytoscape: `fit()` via `cy.fit()`, `exportImage()` via `cy.png({ output: "blob" })` to the same `Promise<Buffer | null>` path, `saveNodePositions()` reading `node.position()` into the topology YAML `ui.position`; verify the toolbar Fit button recenters the graph, Record topology PNG writes a valid image, and after dragging a node the position survives app restart (YAML round-trip)

## 3. Remove vis-network and finish tests

- [x] 3.1 Swap the `vi.mock("vis-network")` stub in `src/components/ProjectPanel.test.tsx` for the cytoscape stub and verify `yarn test` passes
- [x] 3.2 Remove `vis-network`, `vis-data`, and `vis-util` from package.json, run `yarn install`, and verify `yarn test`, `yarn lint`, and `yarn package` all succeed and no file still imports `vis-network` (`grep -r "vis-network" src/` is empty)

## 4. Integration check

- [x] 4.1 Manual smoke against the spec acceptance behaviors on a live server session: persist graph layout (drag node, save, reopen), record topology image (`topology.png` dialog writes bytes), node context menu start/stop/interface actions from the graph, and edge selection feedback — all matching pre-migration behavior

## Workflow follow-up

- Archive the change after the project's review requirements are satisfied.
