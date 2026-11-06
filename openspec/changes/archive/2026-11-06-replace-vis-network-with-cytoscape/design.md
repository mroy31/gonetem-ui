# Design

## Context

`src/components/ProjectGraph.tsx` (~380 lines) is the single component that talks to the graph library. It renders a network topology from the topology YAML: nodes carry per-type/per-state SVG icons, links carry interface-index labels at each endpoint (the `labelFrom`/`labelTo` feature that motivated the local vis-network fork), edges are colored by live interface state, and node positions round-trip through `ui.position` in the YAML file.

Current integration surface:

- `ProjectGraph` exposes an imperative handle `ProjectGrahHandle` — `exportImage()`, `fit()`, `saveNodePositions()` — consumed by `ProjectPanel.tsx` and `ProjectGraphToolbar.tsx`. This contract must not change.
- `NodeContextMenu` is opened from the graph's right-click hit-testing; edge select/deselect flows out through the `onSelectEdge` prop.
- Two test files (`src/app-shell.test.tsx`, `src/components/ProjectPanel.test.tsx`) mock `"vis-network"` with a stub `Network` class; `ProjectPanel.test.tsx` additionally mocks `./ProjectGraph` itself.
- Physics is disabled today; all positions come from the YAML. No auto-layout is used.

Constraints discovered during exploration:

- `img/switch.svg` and `img/switch-running.svg` declare `width="100%" height="100%"` (one also has a stray duplicate `width="3"`). Cytoscape rasterizes SVG backgrounds and needs intrinsic pixel dimensions; percentage-sized SVGs can render blank. `router*.svg` and `host*.svg` already declare explicit pixel sizes.
- vis-network's image shapes scale icons at library defaults; Cytoscape requires explicit `width`/`height` in the node stylesheet.

See proposal.md - Why for motivation (fork removal, maintenance).

## Goals / Non-Goals

**Goals:**
- Remove `vis-network`, `vis-data`, `vis-util` from `package.json`, including the out-of-repo `link:` fork dependency.
- Behavioral parity on every graph-observable behavior already spec'd: layout persistence and PNG export (`topology-definition`), node context menu (`node-management`), edge selection feedback, pan/zoom, fit-to-view, state-driven icons and edge colors.
- Keep `ProjectGrahHandle`, `PropsT`, and `NodeContextMenu` wiring unchanged so no consumer file edits are needed.

**Non-Goals:**
- Auto-layout algorithms (fcose, preset layouts, etc.) — physics is off today and positions stay YAML-driven.
- Visual redesign of icons, labels, or colors — parity is the acceptance bar; only icon sizing may need eyeballing against current rendering.
- Dark-mode graph theming, graph interactions beyond today's (multi-select, box select), or Cytoscape extensions.

## Decisions

**D1: Cytoscape.js core only (no extensions).**
`cytoscape` + `@types/cytoscape` as the only new packages. Alternatives: vis-network v10 (rejected — cannot host the endpoint-label patch upstream; see proposal), cytoscape + fcose/other extensions (rejected — no layouts needed, each extension is another dependency to vet).

**D2: Feature mapping, one-to-one.**

| Today (vis-network) | Cytoscape equivalent |
|---|---|
| `shape: "image"` + per-type SVG, running/stopped variants | `background-image` swapped per state (stylesheet classes or direct style) |
| `shape: "circularImage"` (router) | `background-shape: circle` with `background-fit: cover` |
| `labelFrom`/`labelTo` (fork patch) | `source-label`/`target-label` |
| edge color by interface state | edge classes (`up`/`down`/`inactive`) in a stylesheet |
| `physics: false`, positions from YAML | no layout call; set `position` on each node element |
| `network.getPositions()` / `storePositions()` | `node.position()` per node / `nodes.positions()` |
| `on("oncontext")` + `getNodeAt()` | `cy.on("contextmenu", "node")` + event target |
| `selectEdge`/`deselectEdge` events | `cy.on("select unselect", "edge")` |
| `network.fit()` | `cy.fit()` |
| canvas `toBlob` traversal | `cy.png({ output: "blob" })` |
| `interaction: { dragView, zoomView }` | renderer defaults (both enabled) |

Direct mappings are preferred over clever ones; the stylesheet centralizes colors/icons but dynamic per-state values may stay computed in JS exactly as today.

**D3: Rewrite `ProjectGraph.tsx` internals, keep its public surface.**
The component keeps its props, imperative handle, error handling (`ProjectGraphErrMsg` i18n key), and context-menu state machine. Internally: create `cytoscape({ container, style, elements, ... })` in the existing `useEffect`, destroy/reuse the instance on dependency changes the way the `Network` instance is handled today, and re-create elements (or diff via `cy.json`) when topology/state updates. Rationale: `ProjectPanel`, toolbar, and both spec-pinned behaviors survive untouched, which makes the swap reviewable and revertible in one file. Alternative (wrap cytoscape in a reusable adapter component): rejected — one consumer, no abstraction needed.

**D4: Export via `cy.png({ output: "blob" })`, same Buffer path.**
Preserves the `Promise<Buffer | null>` handle signature and the `topology.png` save flow in `ProjectPanel` byte-for-byte. Rasterization is canvas-based in both libraries, so output format is unchanged.

**D5: Fix the switch SVGs in-repo.**
Add explicit pixel `width`/`height` (matching viewBox aspect, e.g. `width="24" height="24"` → bump to a render-friendly size like 200px for crispness) and drop the stray duplicate `width` attribute in `switch-running.svg`. Alternative (rasterize to PNG assets): rejected — keeps the SVG source of truth; explicit sizes fix the root cause.

**D6: Test mocks swap to cytoscape's headless core.**
Both test mocks become `vi.mock("cytoscape", ...)` returning a stub with the handful of methods `ProjectGraph` touches (`on`, `add`/`json`, `nodes`, `fit`, `png`, `destroy`, element `position(s)`) — same spirit as the current `Network: class { on() {} }` stub. `ProjectPanel.test.tsx` already mocks `./ProjectGraph`, so its cytoscape mock is just hygiene.

**D7 (added during smoke testing): explicit `preset` init layout, rectangular node shape, endpoint-label offsets.**
- Positions passed in the constructor's `elements` are overwritten by cytoscape's default init layout (grid) before `ready`; only `add()` outside the constructor preserves them (reproduced headless). Fix: pass `layout: { name: "preset" }` so the init layout re-applies existing node positions.
- Cytoscape nodes default to `shape: ellipse`, and background images clip to the node shape — host/switch icons rendered as circles. Fix: base node style `shape: "rectangle"` (vis's `image` shape was rectangular); the router rule keeps `background-shape: circle` for the `circularImage` equivalent.
- `source-label`/`target-label` anchor at the node boundary by default and collided with icons. Fix: `source-text-offset`/`target-text-offset: 38` px (node half-size 25 px + gap), approximating the fork's quarter-edge placement; renderer source confirms the offset applies to `curve-style: straight` edges.
- Cytoscape applies no visual change on selection (vis-network's default `chosen` handling lightened the color). Added an `edge:selected` rule: `width: 3` plus a blue overlay band (`overlay-color: #0000FF`, `overlay-opacity: 0.25`, `overlay-padding: 5`) so the selected link is distinguishable against every state color.

## Risks / Trade-offs

- [SVG rasterization surprises beyond the switch icons (e.g., `circularImage` circle clipping of the router icon differing subtly from vis-network's)] → Early visual smoke of all six icons before wiring interactions; adjust `background-fit`/node dimensions, not the assets, unless a file is malformed.
- [Endpoint labels (`source-label`/`target-label`) sit closer to nodes than the fork's 25%/75% placement; on short edges they may crowd icons] → Accept cytoscape's default placement; if crowded, tune per-edge `source-label-boffset`/`target-label-boffset` in the stylesheet.
- [Icon sizing no longer has vis-network's defaults, so rendered node sizes shift slightly] → Choose stylesheet `width`/`height` to match a current-app screenshot; parity is judged visually.
- [Re-render strategy (full `cy.json` replace vs element diff) can drop selection state or jump view on state refresh] → Preserve by saving/restoring viewport (`cy.extent()`/`cy.viewport()`) and selection across element rebuilds — matches how `setData` behaves today.
- [jsdom tests mock the renderer, so regressions in real rendering are invisible to CI] → Manual smoke checklist from spec scenarios (position persistence round-trip, PNG export writes a valid file, context menu, edge select) as a final task.

## Migration Plan

Single-PR swap: add cytoscape deps → rewrite `ProjectGraph.tsx` → fix switch SVGs → swap test mocks → remove vis packages from `package.json`. Rollback = revert the commit; no data migration (topology YAML format is unchanged — `ui.position` keys already match cytoscape's `{x, y}`).
