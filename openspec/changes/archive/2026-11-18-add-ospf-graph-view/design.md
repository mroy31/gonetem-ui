# Design

## Context

`ProjectOspfGraph.tsx` is an empty stub and `ProjectPanel.tsx` renders nothing for `view == "ospf"` (the tab and its running-gating already exist). The transport already exists: `window.api.runNodeExecOnce(prjId, nodeId, cmd)` (src/api/node.ts) runs a one-shot command on a node and resolves `{status: true, result: stdout}` or `{status: false, error}` including the node's stderr on non-zero exit. `ProjectTopoGraph.tsx` establishes the house cytoscape pattern: `containerRef`/`cyRef`, dedicated stylesheet, ResizeObserver-driven `cy.resize()`, and an error alert replacing the canvas on failure. The reference behavior is the gonetem console's `buildOspfGraph`/`ospfViewExec` Go code, which parses two FRR `show ip ospf database ... json` documents and renders a rooted graph.

## Goals / Non-Goals

**Goals:**
- A faithful TypeScript port of the Go graph-construction rules, isolated from React so it is unit-testable against FRR-shaped fixtures.
- A self-contained OSPF view component: fetch state, graph rendering, router tabs, legend.

**Non-Goals:**
- Image export, layout selection toolbar, context menus, label editing, and console integration for the OSPF view (all exist only for the topology view).
- Double-click a router vertex to re-root the view from that router (deferred; the tab navigation covers selection).
- Automatic polling of the link-state databases.

## Decisions

**1. Pure builder module `src/components/ospfGraph.ts`.**
Exports typed interfaces for the FRR JSON shapes and `buildOspfGraph(routerJson, networkJson)` returning `{ rootId, nodes: {name, kind}[], edges: {source, target, cost, interfaceAddress}[] }`, porting the Go rules verbatim: router vertices from every `advertisingRouter` (even link-less), transit name = DR address masked by the network-LSA prefix length with bare-address fallback, transit-edge dedup per (owner, transit) pair, p2p dedup where the smaller router-id's view wins unless the neighbor originates no LSA, stubs in a dedicated second pass so a subnet that is transit anywhere keeps transit typing, /32 stubs hidden, same-prefix stub advertisements merged, areas merged via shared vertex interning. The queried `routerId` is the root; an answer without one raises a typed "no OSPF data" error mirroring Go's `ospfNoDataError`.
*Alternative:* building elements inside the component — rejected; the dedup/second-pass rules are subtle and need direct unit tests. Tests vendor two JSON fixtures adapted from the gonetem repo's `testdata/ospf_*` files plus hand-built cases for one-sided adjacencies, multi-area merging, and /32 hiding.

**2. Fetch layer inside the component.**
On router-tab select or refresh, run both `runNodeExecOnce(prjId, node, ["vtysh", "-c", 'show ip ospf database router|network json'])` calls with `Promise.all`, mirroring Go's `ospfViewExec.fetch`. Three outcomes: exec/transport error → error alert; parsable JSON without `routerId` → localized "no usable OSPF data" alert; success → render. A monotonically increasing request token discards responses from superseded selections (fast tab clicking). No polling.
*Alternative:* a dedicated IPC handler doing both execs server-side — rejected; reuses zero new plumbing and keeps the API surface unchanged.

**3. Layout: built-in `breadthfirst` rooted at the queried router-id vertex** (`{ name: "breadthfirst", roots: [rootId], padding }`, run on `nodes().not(...)`-free full graph), then `cy.fit()`. Re-run after every fetch since the root changes. The layout gets an explicit `boundingBox` sized from the graph's own BFS level structure (`ospfLayoutBox`: widest level × node width, level count × row height): breadthfirst defaults its box to `cy.extent()` (viewport-dependent), and re-fitting a reused cy instance feeds each fit's zoom-out back into the next layout's spread, compounding node shrinkage on every router switch. `cy.fit()` is capped at zoom 1.25 so small graphs stay comfortably legible.
*Alternatives:* `cytoscape-dagre` — deliberately not added (new dependency, and its greedy cycle-breaking produces arbitrary layering on cyclic link-state graphs); `cytoscape-fcose` force layout — cannot pin a root and its layout doesn't communicate reachability tiers; `concentric` with a BFS-rank node function — viable fallback if breadthfirst reads poorly, kept as an open question.

**4. Rendering: own stylesheet, not the topology `cyStyle`.**
All vertices `shape: rectangle` with white background, `"border-color": "data(color)"`, and the `data(name)` label centered inside the rectangle in bold using the vertex's kind color as text color; kind colors router `#2b6cb0`, transit `#91bf8f`, stub `#696969` (echoing the topology view's blue labels / green up / inactive gray). Edges straight with `source-label` = advertised cost and `target-label` = originating interface address (p2p only, empty otherwise), reusing the topo edge-label offset conventions. Colors are assigned by the builder, so the stylesheet stays content-agnostic.
*Alternative:* icons per vertex kind — rejected by the user in favor of rectangle + color.

**5. Legend as an absolute-positioned overlay** in the cytoscape container's top-right corner: three color chips with localized kind names; new en/fr keys `OspfKindRouter`, `OspfKindTransitNetwork`, `OspfKindStubNetwork`, plus keys for the no-data and fetch-error messages.
*Alternative:* a toolbar row — rejected; the view has no toolbar in v1.

**6. Component shape: one component, no container/toolbar split.**
`ProjectOspfGraph` takes `{ prjId, status, topology }`, owns `selectedRouter` state (initialized to the first eligible router, reset on `prjId` change), and renders a vertical flex: graph area (with legend overlay) plus a daisyUI `tabs tabs-box` footer. Router eligibility: topology YAML parsed with the existing `yaml` dependency; a node is eligible when `type.startsWith("docker.router") || type === "docker.vyos"` — broader than Go's `ospfExec` gate because VyOS ships FRR; recorded as an intentional divergence. Tab set is stable (topology-derived, OSPF-data-independent).
*Alternative:* a `ProjectOspfGraphContainer` mirroring the topo split — rejected; there are no imperative toolbar handles to wire.

**7. Graph re-render on each fetch: `cy.elements().clear()` + `cy.add(elements)` + layout.**
No element diffing (unlike the topo view) because every fetch replaces the whole graph and re-runs the root layout; the topo `updateElements` pattern only pays off under frequent partial updates.

## Risks / Trade-offs

- Port drift from the Go rules (p2p "smaller id wins", stub second pass) → unit tests encode each rule with named fixtures; port line-by-line rather than by summary.
- FRR JSON shape differs across FRR versions → parse defensively (missing `areas`, missing `routerLinks`, string/number mask mismatches degrade to bare-address labels like Go does) and keep the no-data alert as the catch-all.
- `docker.router` images without FRR installed make `vtysh` fail → surfaces as the existing fetch-error path (exit code + stderr already propagate through `runNodeExecOnce`).
- Full clear+re-add loses user zoom/pan on every refresh → accepted for v1; layout re-rooting already rewrites positions, and `cy.fit()` keeps the result visible.
- Large areas (dozens of vertices) rendered by breadthfirst can spread wide → `fit()` mitigates; concentric fallback documented above.
