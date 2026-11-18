# Design

## Context

The project view is a CSS grid `grid-cols-[auto_min-content]` (ProjectPanel.tsx). The right track is pinned to the context panel's inline width and the left `auto` track has a content-based minimum dominated by the cytoscape `<canvas>` intrinsic pixel size, so neither track can shrink and the grid's intrinsic width escapes the viewport when the panel grows. The panel's resize logic (ProjectContextPanel.tsx) adds `mousemove`/`mouseup` listeners on every mount without cleanup and applies no bounds to the width. Cytoscape paints into a canvas sized at init and does not follow container resizes on its own.

See proposal.md for motivation and specs/project-workspace-layout for required behavior.

## Goals / Non-Goals

**Goals:**
- One flexible track absorbs every panel width change; nothing else overflows.
- The graph canvas tracks its container box, whatever changes that box.
- Resize drag is leak-free and bounded.

**Non-Goals:**
- No persisted panel width across sessions.
- No drag-and-drop reordering, collapsible panel, or keyboard resize.
- No rework of the tab/content behavior inside the panel.

## Decisions

**Grid tracks: `minmax(0, 1fr)` for the graph column, `auto` for the panel column.**
`minmax(0, 1fr)` gives the graph track a hard zero floor and lets it absorb free space, so the right track can size to the panel while the total stays viewport-bound. Alternatives: converting the whole row to flexbox with `min-w-0` (larger diff, no benefit); keeping `auto` and forcing `min-width: 0` on the graph column div (still leaves the `min-content` right track fragile against panel min-content). Tailwind arbitrary value: `grid-cols-[minmax(0,1fr)_auto]`.

**Canvas follow: `ResizeObserver` on the cytoscape container calling `cy.resize()`.**
A `window` resize event alone misses panel drags (the container changes while the window does not), and cytoscape's default `autolock: false` still needs an explicit `resize()` when the container is resized without a window event. The observer covers panel resizes and window resizes with one mechanism. Observer is disconnected on unmount.

**Drag hygiene: register `mousemove`/`mouseup` in the existing effect and remove them in its cleanup.**
Keeps the current window-level listener pattern (survives the pointer leaving the handle) while fixing the leak. Clamp inside the width updater: lower bound `MIN_PANEL_WIDTH = 250` px; upper bound `window.innerWidth - MIN_GRAPH_WIDTH` with `MIN_GRAPH_WIDTH = 300` px, evaluated at drag time so the bound follows window resizes. The existing `width` state stays in px (rendered as `width / 16` rem), clamping in px keeps drag math consistent with `e.movementX`.

## Risks / Trade-offs

- [`cy.resize()` on every observer tick during a drag] → Observer callbacks are already coalesced per frame; `resize()` only recomputes canvas backing size. If jank appears, debounce before calling, but do not pre-optimize.
- [Fixed px minimums don't scale to very small windows] → The upper bound is derived from `window.innerWidth`, so on a narrow window the panel simply gets less room; if `innerWidth - 300` were below 250, the lower bound wins and the graph area keeps its 300 px floor by overflowing at absurd window sizes only.
- [`ResizeObserver` loop warnings if `cy.resize()` changed the container size] → `resize()` only sizes the canvas to the container, not the reverse, so no cycle is expected.
