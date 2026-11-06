# Tasks

## 1. Dependency setup

- [x] 1.1 Add `cytoscape-fcose@^2.2.0` to renderer dependencies with yarn and verify installation resolves against cytoscape 3.34.4
- [x] 1.2 Add `declare module "cytoscape-fcose"` under `types/` and register the extension with `cytoscape.use(...)` in the graph module; verify `yarn lint` and `yarn test` pass and the app builds (`yarn start` launches)

## 2. Automatic initial layout

- [x] 2.1 Extract a pure helper that reports whether any node in a parsed topology has a saved `ui.position`, with unit tests covering none/some/all cases (node-project test)
- [x] 2.2 On graph creation, use the fcose layout when no saved positions exist and `preset` otherwise, fitting the view when the layout stops; verify with `yarn start` that a topology file without `ui.position` opens as an arranged, fitted graph and a positioned topology still opens at its saved spots

## 3. Layout menu

- [x] 3.1 Extend `ProjectGrahHandle` with `applyLayout(kind)` mapping Force/Grid/Concentric/Hierarchical to fcose/grid/concentric/breadthfirst runs over the whole graph, each followed by `fit` on layout stop; verify each menu entry rearranges the graph in `yarn start`
- [x] 3.2 Add the DaisyUI dropdown to `ProjectGraphToolbar` wired to `applyLayout`, styled like the existing toolbar buttons; verify it renders next to Fit/Image/Save and re-running the same entry re-runs the layout
- [x] 3.3 Add i18n keys for the menu title and the four layout entries to every locale file under `app/localization/locales`; verify no missing-key warnings in the console when switching locales

## 4. Integration checks

- [x] 4.1 Run `yarn lint` and `yarn test` clean
- [x] 4.2 Smoke the spec scenarios end to end in `yarn start`: fresh topology opens arranged; saved positions win over auto-layout; applying a layout without Save does not change the YAML file, and applying then saving persists the new positions

## Workflow follow-up

- Archive the change after review, syncing the `topology-definition` spec delta.
