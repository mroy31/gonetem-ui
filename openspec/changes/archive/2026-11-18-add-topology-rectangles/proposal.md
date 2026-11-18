# Proposal

## Why

Users annotating network topology diagrams (e.g., circling an OSPF area or a network zone) currently can only add free-floating text labels. There is no way to visually delimit a region of the canvas around a group of nodes, which is the standard way network diagrams show areas, zones, and groups. The existing labels feature already proves the whole pattern (free-floating canvas decoration persisted in the network file), so a rectangle is its natural sibling: a label plus a size.

## What Changes

- On the topology graph canvas, users can create decorative rectangles: empty fill, dotted border, no text.
- A rectangle is created from the canvas right-click menu ("Add rectangle" entry beside the existing add-label entry) and appears at the right-click position with a default size.
- Rectangles are moved by dragging, resized with corner handles shown while selected, and deleted from their right-click context menu (same pattern as labels).
- Rectangles are persisted in the network file under the top-level `ui` section (`ui.rects`, keyed by generated `rect-`prefixed ids, storing center position, width, height), rendered back on open, included in fit-to-view and image export, and never moved by graph layouts — mirroring the labels rules.
- All creation/editing entries are gated on the full edition (`features.topologyWrite`); the student edition renders stored rectangles read-only like labels.

## Capabilities

### New Capabilities
- `topology-rectangles`: Decorative dotted-border rectangles on the topology canvas — creation, move, resize, deletion, persistence in the network file's `ui` section, rendering, and their exclusion from layouts and node-position persistence.

### Modified Capabilities
<!-- none: no requirement in an existing capability changes. Rectangles are new behavior owned by topology-rectangles; topology-labels and topology-definition requirements are untouched. -->

## Impact

- `src/components/`: new pure module `topologyRects.ts` (parse/serialize/id/merge, twin of `topologyLabels.ts`); `ProjectTopoGraph.tsx` (stylesheet entry for `.rect` nodes, element loading, save merge, layout/position-save exclusions, right-click wiring, DOM resize-handle overlay); `LabelContextMenu.tsx` gains a rectangle menu mode (or a sibling component).
- Network file format: additive top-level `ui.rects` map; files without it render unchanged.
- Known tradeoff (accepted): rectangle interiors capture pointer events (drag-inside moves the rect), so canvas panning is not possible from inside a rectangle; nodes and edges still take precedence on overlap.
- No server, gRPC/proto, or IPC changes — the topology file is already read/written as text.
- i18n keys for the new menu entries in all locales supported by the `localization` capability.
