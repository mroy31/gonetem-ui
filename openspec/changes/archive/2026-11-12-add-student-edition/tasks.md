# Tasks

## 1. Edition foundation

- [x] 1.1 Create `scripts/edition-env.js` that reads `GONETEM_EDITION`/`GONETEM_SERVER_URI`, defaults to full, and throws for an edition value other than `full`/`student` or a student edition with an empty URI; verify with `node -e` calls showing the default returns `full`, `GONETEM_EDITION=beta` throws, and student-without-URI throws.
- [x] 1.2 Inject `__APP_EDITION__` and `__STUDENT_SERVER_URI__` via `webpack.DefinePlugin` in `webpack.main.config.js` and the renderer plugins chain (through `webpack.plugins.js` so the preload bundle gets them too), and declare both constants ambiently under `types/`; verify `yarn start` boots the full app and `GONETEM_EDITION=student GONETEM_SERVER_URI=localhost:10110 yarn start` compiles and boots (confirm `__APP_EDITION__` is visible inside `src/preload.ts` via a temporary devtools `console.log`).
- [x] 1.3 Create `src/edition.ts` exporting `edition`, `studentServerUri`, and the `features` map (`topologyWrite`, `topologyValidation`, `nodeConfigRead`, `optionsWrite`) derived from the constants, and add `define` entries for both constants (full-edition defaults) to `vitest.config.mts` for the node and jsdom projects; verify `yarn test` still passes and a throwaway unit test reads `edition === "full"` in both projects.
- [x] 1.4 Add `scripts/pack.js <edition> <forge-command>` cross-platform wrapper that sets the env vars, reuses the 1.1 validation, and spawns `yarn electron-forge`; verify `node scripts/pack.js bad make` exits with the validation error before Forge runs and `node scripts/pack.js student package` (with URI set) starts Forge.

## 2. Main-process gating

- [x] 2.1 Extract IPC handler registration from `src/index.ts` into a testable helper and wrap registration of `server:writeTopology`, `server:checkTopology`, `server:readNodeConfigFiles`, `client:setOptions` in `features` guards; verify with a new vitest node test using `vi.mock` of `src/edition.ts` that the student edition records exactly those four channels as unregistered while the full edition registers all channels listed in `src/index.ts`.
- [x] 2.2 Gate `handleGetOptions` in `src/api/options.ts` to return baked student values (baked server URI, autoconnect enabled, TLS disabled, default console command) without reading electron-store under the student constant; verify by extending `src/api/options.test.ts` with a student-edition case asserting the returned options and that the store is not consulted.

## 3. Preload gating

- [x] 3.1 Build `exposedApi` in `src/preload.ts` so gated methods (`writeTopologyFile`, `checkTopologyFile`, `readNodeConfigFiles`, `setOptions`) are absent from `window.api` in a student build; verify in the running student app (1.2 command) that those four keys are missing from `window.api` in devtools while all non-gated keys are present.

## 4. Renderer gating

- [x] 4.1 In `src/app.tsx`, hide the Options button and `OptionsModal` under `features.optionsWrite` and show a "Student edition" badge in the navbar when the edition is student; add the badge key to `app/localization/locales/en` and `fr`; verify with an RTL test (mocking `window.api` per existing test patterns and `src/edition.ts`) asserting the Options button/badge presence per edition, and confirm both locales carry the key.
- [x] 4.2 In `src/components/ProjectContextPanel.tsx`, render only the Console tab in the student edition (Configuration and Topology tabs absent, their panels' imports referenced only in the full-edition branch); verify with an RTL test asserting tab sets for both editions.
- [x] 4.3 In `src/components/ProjectGraphToolbar.tsx` and `src/components/ProjectPanel.tsx`, remove the graph Save button and its `saveTopologyHandle` wiring under `features.topologyWrite`; verify with an RTL test that the student toolbar has Save-absent, Fit/Image/Layout present, and the full toolbar unchanged.
- [x] 4.4 In `src/components/ProjectGraph.tsx`, `LabelContextMenu.tsx`, and `LabelTextModal.tsx`, suppress label add/edit/delete entries and the double-click edit dialog in the student edition while keeping label rendering and ephemeral dragging; verify with RTL tests on the context-menu items per edition and a manual student-dev check that double-clicking a label opens nothing.

## 5. Packaging identity

- [x] 5.1 Set `packagerConfig.name`, the Squirrel maker `name`, and the maker-deb package name from the edition in `forge.config.js`, and set the Electron app name for the student edition via `src/app-edition-identity.ts` (verified: electron-packager keeps the inner `package.json` name identical across editions, so `app.setName` is what separates `app.getPath('userData')`). Verified by packaging: `node scripts/pack.js student package` (with URI set) produces `gonetem-ui-student.app` (distinct bundle/display name), launching it creates a separate `~/Library/Application Support/gonetem-ui-student` store dir, and a full `yarn package` still uses `gonetem-ui` unchanged.
- [x] 5.2 Build both editions' distributables (`node scripts/pack.js student make` and `yarn make`) and verify side-by-side behavior: both launch, each stores its own electron-store user data, and the student app autoconnects to the baked URI at startup without any options UI.

## 6. Integration checks

- [x] 6.1 Run `yarn lint` and `yarn test` green for the whole repo.
- [x] 6.2 Walk the spec scenarios against a student build (`GONETEM_EDITION=student GONETEM_SERVER_URI=... yarn start`): badge shown, no Options/tabs/Save/label-editing/config viewer, project open + Save/Reload/Run + node consoles work, layout rearrangement lost on reopen, invoke on a gated channel fails with no-handler error; then re-walk the same flows on the full build unchanged.
- [x] 6.3 Inspect the student renderer webpack output and confirm the student edition's gated behavior is enforced at all three layers (gated IPC handlers unregistered, gated `window.api` methods absent, gated UI not rendered). Accept that the minimized student bundle still contains the unreachable editor/config/label code (dead branches are retained by Forge's webpack, mirroring the main bundle); bundle-level absence of that code is a non-goal.

## Workflow follow-up

- Archive the change after review requirements are satisfied.
