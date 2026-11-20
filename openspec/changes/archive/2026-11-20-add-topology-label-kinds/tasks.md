# Tasks

## 1. Label kind model (topologyLabels.ts)

- [x] 1.1 Add a `LabelKind` type (`"as" | "subnet"`), add `kind` to `TopologyLabel`, and make `parseTopologyLabels` read `entry.kind`, mapping `"as"` to `as` and any missing or unknown value to `subnet`; verify with cases in `src/components/topo-graph/topologyLabels.test.ts` (explicit kinds, legacy entries without kind, unknown kind string) via `yarn test src/components/topo-graph/topologyLabels.test.ts`
- [x] 1.2 Make `serializeLabels` accept and always write `kind` on each entry, and update `mergeLabelsIntoTopology` callers' entry shape accordingly; verify with round-trip cases in `topologyLabels.test.ts` (parse then serialize preserves `as` and `subnet`, legacy parse serializes as explicit `subnet`) via `yarn test src/components/topo-graph/topologyLabels.test.ts`
- [x] 1.3 Extend `applyLabelConfirm` so create takes a kind (defaulting to `subnet`) and update also sets the kind, keeping id and position stable across kind changes; verify with add/edit kind cases in `topologyLabels.test.ts` via `yarn test src/components/topo-graph/topologyLabels.test.ts`

## 2. Kind selector in the label modal (LabelTextModal.tsx)

- [x] 2.1 Add `kind` prop and `onConfirm(text, kind)` signature with a Subnet/AS-number radio group (default `subnet` on add, prefilled on edit, no format validation on text); verify by updating `src/components/topo-graph/LabelTextModal.test.tsx` (default selection, chosen kind returned, edit prefills current kind) via `yarn test src/components/topo-graph/LabelTextModal.test.tsx`
- [x] 2.2 Add the kind label keys to `app/localization/locales/en/translation.json` and `app/localization/locales/fr/translation.json` (e.g. `LabelKindLabel`, `LabelKindSubnet` "Subnet"/"Sous-réseau", `LabelKindAsNumber` "AS number"/"Numéro AS") next to the existing `AddLabelMenu` entries; verify with `yarn test src/i18n/main.test.ts` and by rendering the modal keys in the group 2 tests

## 3. Graph wiring and styles (ProjectTopoGraph.tsx)

- [x] 3.1 Add `label-as` and `label-subnet` to `ALL_CLASSES`; move the sticky-note look from `node.label` into a `node.label-subnet` style block and add a `node.label-as` block (`background-opacity: 0`, `border-width: 0`, `font-weight: bold`, `font-size: 14`, `color: "#0e7490"`), keeping shared geometry (`width/height: "label"`, wrap, padding) on `node.label` (rects already paint behind via their `z-index: -1`); verify the style array contains both selectors in `src/components/topo-graph/projectTopoGraphLabels.test.ts` via `yarn test src/components/topo-graph/projectTopoGraphLabels.test.ts`
- [x] 3.2 In `buildGraphElements`, give each parsed label the classes `label label-as`/`label label-subnet` from its kind and store `kind` in element data; verify elements built from a topology with `ui.labels` entries (explicit kinds and legacy kindless) carry the right classes and `kind` data via `yarn test src/components/topo-graph/projectTopoGraphLabels.test.ts`
- [x] 3.3 In the save path, collect `kind` from label element data into the serialized entries; verify saved topology JSON carries the kind per label in `projectTopoGraphLabels.test.ts` via `yarn test src/components/topo-graph/projectTopoGraphLabels.test.ts`
- [x] 3.4 Extend the `labelModal` state with `kind`, prefill it on `dbltap` from the element's kind, and pass the modal's confirmed kind through `applyLabelConfirm`; verify add-with-default-subnet, add-as-AS, and edit-kind-change behavior through the component in `projectTopoGraphLabels.test.ts` via `yarn test src/components/topo-graph/projectTopoGraphLabels.test.ts`

## 4. Integration checks

- [x] 4.1 Run `yarn test`, `yarn lint`, `yarn typecheck`, and `yarn format:check` and fix any fallout across the touched files
- [x] 4.2 Run `yarn start`, open a project with legacy kindless labels, confirm sticky rendering is unchanged, create one AS and one subnet label, save, reopen, and confirm both kinds and styles round-trip

## Workflow follow-up

- Archive the change after review with `/opsx-archive`.
