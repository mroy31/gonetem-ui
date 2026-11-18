# Proposal

## Why

Dragging the ProjectContextPanel resize handle to widen the panel makes the whole application content grow horizontally instead of shrinking the graph area: no grid track is allowed to give way, so the overflow escapes the layout and the window appears to expand. The context panel is a core part of every project view, so the broken resize is felt constantly.

## What Changes

- The project view's grid layout changes so the graph column is a flexible track that shrinks when the context panel widens (and vice versa), keeping the overall width fixed to the window.
- The topology graph canvas follows its container: when the graph area's box changes (panel resize or window resize), the rendered graph re-fits the new size instead of keeping its initial pixel size.
- The context panel resize handle stops leaking its mouse listeners (removed on unmount) and clamps the panel width to a sane minimum and maximum so it can never be dragged off-screen or to zero.

No APIs, data formats, or server interactions change. No user-facing feature is added or removed; the existing drag-to-resize affordance simply behaves correctly.

## Capabilities

### New Capabilities

- `project-workspace-layout`: how the project view arranges the graph area and the context panel side by side, including user-driven panel resizing and how the graph viewport adapts to its container size.

### Modified Capabilities

<!-- No existing spec covers panel layout or viewport resize behavior; none is modified. -->

## Impact

- `src/components/ProjectPanel.tsx`: grid track sizing (`grid-cols-[auto_min-content]` replaced by a flexible/minmax layout).
- `src/components/ProjectContextPanel.tsx`: resize listener lifecycle (cleanup), width clamping (min/max).
- `src/components/ProjectGraph.tsx`: observe container size changes and re-fit the cytoscape viewport.
- No dependency, build, or server-side impact.
