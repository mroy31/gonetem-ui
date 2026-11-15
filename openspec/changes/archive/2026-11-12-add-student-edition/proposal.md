# Proposal

## Why

Courses need a locked-down student client: students should run and explore topologies prepared by the teacher, not edit them. The edition must be decided at packaging time so the student binary simply lacks the editing capability, rather than hiding it behind a runtime setting a student could flip.

## What Changes

- Introduce build-time editions: `full` (default, current behavior) and `student`, selected via `GONETEM_EDITION` at build/package time.
- Student builds embed a server URI baked at package time (`GONETEM_SERVER_URI`) and autoconnect to it; no options dialog exists. TLS settings are not exposed in the student edition.
- Student edition removes these features at all three layers (main-process handlers never registered, preload never exposes the methods, UI never renders): topology YAML editor ("Topology" tab), topology save action (graph toolbar "Save" button for node positions), label editing (add/edit/delete; labels stay rendered read-only), configuration viewer ("Configuration" tab), and the options modal (connection settings).
- Kept for students: open/create/connect to projects, project Save/Reload/Run, topology graph view with layouts/fit/image export, node consoles, node start/stop/restart, interface up/down, capture, and server image pull.
- Student builds use a distinct application name (separate window-manager identity and user-data storage) and show a "Student edition" badge in the navbar.

## Capabilities

### New Capabilities
- `app-editions`: build-time edition selection, baked student server configuration, the restricted student feature set and its enforcement across process boundaries, edition identity/naming and coexistence.

### Modified Capabilities
- `topology-definition`: topology write and validation requirements become full-edition-only.
- `topology-labels`: label add/edit/delete and persistence to the network file become full-edition-only; label rendering remains in both editions.
- `node-management`: reading and displaying node configuration files becomes full-edition-only.
- `app-preferences`: persisting and updating user options from the options dialog becomes full-edition-only.

## Impact

- Build: `forge.config.js`, `webpack.main.config.js`, `webpack.renderer.config.js`, `vitest.config.mts`, new pack wrapper script; no new dependencies (frozen dependency set respected).
- Shared: new `src/edition.ts` single source of truth fed by webpack DefinePlugin constants; `types/window.d.ts` stays as the full-edition surface.
- Main: `src/index.ts` (conditional handler registration), `src/api/options.ts` (baked options in student build).
- Preload: `src/preload.ts` conditional API exposure.
- Renderer: `src/app.tsx` (Options button/modal, navbar badge), `src/components/ProjectContextPanel.tsx` (tabs), `ProjectPanel.tsx`, `ProjectGraphToolbar.tsx` (Save button), `ProjectGraph.tsx` + `LabelContextMenu.tsx` + `LabelTextModal.tsx` (label editing entry points), `ConfigurationViewerPanel.tsx` import gating.
- Packaging: app/product name per edition (packager + Squirrel + deb maker config) so editions coexist on one machine.
- Locales: one new string for the student badge (i18next, both locales).
