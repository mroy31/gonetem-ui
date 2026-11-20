# Proposal

## Why

Topology graph labels are today a single sticky-note style with free text, so users cannot visually distinguish network annotations that carry different meanings — an AS number versus a subnet — at a glance on the canvas or in exported images.

## What Changes

- Labels gain a kind: `as` (AS number) or `subnet`. The kind is a pure styling choice; the text content stays free-form with no format validation.
- The label text modal (add and edit) gains a kind selector; Subnet is the default selection when adding. The canvas context menu keeps a single "Add label" entry.
- A subnet label renders exactly like today's sticky note. An AS label renders as borderless, background-free bold text in a distinct color at a larger size than subnet labels.
- Each saved label entry in the network file's top-level `ui` labels map gains a `kind` field, always written explicitly on save.
- Backward compatibility: an entry whose `kind` is missing or unknown is rendered as a subnet label, so existing files render exactly as before.

## Capabilities

### New Capabilities

(None)

### Modified Capabilities

- `topology-labels`: label creation and editing let the user choose the label kind in the modal; persistence stores the kind per entry and defaults missing/unknown kinds to subnet on load; rendering applies per-kind styles, with an AS label styled as bold borderless text distinct from the subnet sticky note.

## Impact

- `src/components/topo-graph/topologyLabels.ts` — parse/serialize carry `kind`; creation/update operations take the kind.
- `src/components/topo-graph/LabelTextModal.tsx` — kind radio selector in the add/edit dialog.
- `src/components/topo-graph/ProjectTopoGraph.tsx` — `.label-as` / `.label-subnet` classes and two cytoscape style blocks; load/save wiring.
- `app/localization/locales/{en,fr}/translation.json` — new kind labels.
- Network file format: additive `kind` field inside `ui.labels` entries; files from this change open unchanged in older versions (older versions ignore the extra field).
