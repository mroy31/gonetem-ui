# Tasks

## 1. Fixed-width graph/panel grid

- [x] 1.1 Change the project view grid in src/components/ProjectPanel.tsx from `grid-cols-[auto_min-content]` to `grid-cols-[minmax(0,1fr)_auto]` and verify with `yarn typecheck && yarn test` plus observable behavior: widening the panel never grows the application content beyond the window width

## 2. Graph viewport follows its container

- [x] 2.1 In src/components/ProjectGraph.tsx, attach a ResizeObserver to the cytoscape container that calls `cy.resize()`, disconnect it on unmount, and verify with `yarn test` (no regressions in suites that mount panels) plus observable behavior: the canvas follows panel drags and window resizes without reloading the project

## 3. Drag hygiene: listener cleanup and width clamps

- [x] 3.1 In src/components/ProjectContextPanel.tsx, remove the `mousemove`/`mouseup` window listeners in the effect cleanup and add a test that resizing does nothing after unmount; verify with `yarn test`
- [x] 3.2 Clamp the panel width in src/components/ProjectContextPanel.tsx to a 250 px minimum and `window.innerWidth - 300` px maximum, and add tests simulating drags past each bound; verify with `yarn test`

## 4. Integration check

- [x] 4.1 Run `yarn lint && yarn typecheck && yarn test` green and manually walk every scenario in specs/project-workspace-layout/spec.md (drag wider/narrower, release stops, both clamps, graph follows resizes)

## Workflow follow-up

- Archive the change after the project's review requirements are satisfied.
