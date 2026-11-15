# Design

## Context

Electron Forge + webpack build with three JS bundles from one repo: main (`webpack.main.config.js`, `minimize: false`), renderer and preload (both built by the Forge webpack plugin from `webpack.renderer.config.js`). `forge.config.js` is plain JS evaluated at pack time. The renderer reaches main only through `window.api` built in `src/preload.ts` over `ipcRenderer.invoke`; handlers are registered in `src/index.ts`. Options live in `electron-store`, whose user-data path derives from the app name. Dependency set is frozen (AGENT.md): no new runtime dependencies. Behavior contract: see `specs/app-editions/spec.md` and the modified deltas in this change.

## Goals / Non-Goals

**Goals:**
- One codebase, two editions; edition fixed at pack time, immutable at runtime.
- Enforcement at depth: gated IPC handlers never registered in student builds, gated methods absent from `window.api`, gated UI never rendered.
- Zero behavior change for the full edition (`GONETEM_EDITION` unset ⇒ today's app).
- Editions installable side-by-side on one machine.

**Non-Goals:**
- Server-side authorization (a student editing the asar can re-enable features; the gonetem server remains the only true trust boundary).
- Hiding dead code in the main bundle (`minimize: false` stays; the student main bundle still contains the unreachable full-edition code — only registration is gated).
- Per-student accounts, remote lockdown, or a runtime "teacher unlock".

## Decisions

### D1: Edition carried by env vars, injected as webpack literals
`GONETEM_EDITION` (`full` default | `student`) and `GONETEM_SERVER_URI` are read by a shared helper `scripts/edition-env.js`, required from `forge.config.js`, `webpack.main.config.js`, and `webpack.renderer.config.js`. The helper validates (fail fast: unknown edition value; student edition with empty URI) and returns constants injected via `webpack.DefinePlugin` as `__APP_EDITION__` and `__STUDENT_SERVER_URI__` string literals. Renderer config plugins are used for both renderer and preload bundles by the Forge webpack plugin (verify during implementation that the preload bundle sees the constants).
*Alternatives:* a runtime config file in `extraResource` (rejected: edition must be immutable and decided at pack time); `resolve.alias` to per-edition modules (rejected: constants fold and enable dead-code elimination in the minimized renderer, aliasing does not).

### D2: Single gating module `src/edition.ts`
Exports `edition`, `studentServerUri`, and a `features` map (`topologyWrite`, `topologyValidation`, `nodeConfigRead`, `optionsWrite`, derived from `edition`). Every gate in main/preload/renderer consumes this module; components never branch on the raw constant. Ambient constant declarations go in `types/` (ts-loader runs `transpileOnly`). The DefinePlugin literals make every gate inert at runtime in the student build (the gated branches never execute), but Forge's webpack build does not eliminate the gated imports across module boundaries — verified during implementation: the minimized student renderer still contains the CodeMirror/YAML editor chain and the label/config components as unreachable code. Enforcement is therefore behavioral and at depth: gated IPC handlers are never registered, gated `window.api` methods are never exposed, and gated UI is never rendered — mirroring the same dead-branch retention that already exists in the (unminimized) main bundle.
*Alternative:* scattering `__APP_EDITION__ === "student"` checks (rejected: one place to keep the feature list canonical).

### D3: Gate at all three layers
- **Main (`src/index.ts`)**: wrap `ipcMain.handle` registrations for `server:writeTopology`, `server:checkTopology`, `server:readNodeConfigFiles`, `client:setOptions` in `if (features.*)` so student builds never register them; also skip importing their handler bodies via the same guards where webpack can fold them.
- **Preload (`src/preload.ts`)**: build `exposedApi` conditionally so gated methods are absent from `window.api` in student builds.
- **Renderer**: `app.tsx` hides the Options button/modal and shows the badge; `ProjectContextPanel` drops the Topology and Configuration tabs (Console only); `ProjectGraphToolbar` drops the Save button; `ProjectPanel` drops `saveTopologyHandle` wiring; `ProjectGraph`/`LabelContextMenu`/`LabelTextModal` drop label add/edit/delete entries while keeping label rendering and drag as ephemeral local changes.
`types/window.d.ts` remains the full surface (gated call sites only exist in gated components; accepted).

### D4: Student options = baked values, store untouched
In `src/api/options.ts`, `handleGetOptions` returns `{ server: __STUDENT_SERVER_URI__, autoconnect: true, tls: disabled, consoleExternalCmd: default }` under the student constant, without reading the store; `handleSetOptions` is not registered. Window bounds and directory memories keep using the store unchanged, so students still get remembered window geometry. The existing autoconnect-at-launch logic needs no change: it already fires when autoconnect is on and the URI is non-empty.
*Alternative:* seeding electron-store defaults with baked values (rejected: a student editing the JSON in userData could redirect the server; baked return values are read-only).

### D5: Edition identity via packager and maker names
`forge.config.js` sets `packagerConfig.name` (`gonetem-ui` / `gonetem-ui-student`), the Squirrel maker `name`, and the maker-deb package name per edition — this changes the `.app` bundle name and `CFBundleName` but **not** the packaged `package.json` name (verified: the packaged student `package.json` still says `gonetem-ui`), and `CFBundleName` does not affect Electron's `userData` path. Without extra action both editions shared `~/Library/Application Support/gonetem-ui` (verified by launching the packaged student app). Therefore `src/app-edition-identity.ts` (imported first in `src/index.ts`, before `api/options` constructs the `electron-store`) calls `app.setName("gonetem-ui-student")` for the student edition only, which makes `app.getPath('userData')` — and thus electron-store — distinct per edition. Names chosen: `Gonetem UI Student` display dir/identity vs `Gonetem UI`; exact strings confirmed by a verification task running `yarn make` per edition.
*Alternative:* same name, runtime userData switch (rejected: makers would produce conflicting packages on Linux).

### D6: Test and dev strategy
`vitest.config.mts` gains `define` defaults matching the full edition; gating tests `vi.mock("../edition")` to simulate the student edition — component tests assert absence of Options button/tabs/Save/label entries, main-process tests (existing `testfakes` pattern) assert gated channels are not registered and student `getOptions` returns baked values. `GONETEM_EDITION=student GONETEM_SERVER_URI=... yarn start` runs the student edition in dev; a `scripts/pack.js <edition> <forge-cmd>` wrapper sets env vars cross-platform (PowerShell-safe) and reuses the D1 validation, honoring the frozen-dependency rule (no cross-env package).

## Risks / Trade-offs

- [Forge webpack plugin may treat preload as a separate compilation that ignores renderer `plugins`] → verify preload constants early (first task); fallback: add DefinePlugin via `webpack.plugins.js` or the plugin's documented hook.
- [Depth-3 gate is bypassable by editing `app.asar`] → accepted threat model: classroom friction, not DRM; real enforcement would need server authz (gonetem project).
- [Dead branches survive in the built bundles (both the unminimized main and the minimized renderer)] → the guards are runtime-effective (handlers unregistered, methods absent, UI not rendered); grep-level absence of the editor/config/label code from the student renderer is a non-goal, confirmed during implementation (Forge's webpack does not drop the gated imports across module boundaries).
- [Two makers hardcode identity strings (squirrel `name`, deb)] → both set from the same edition helper; side-by-side install check per platform before release.
- [i18n badge key missing in one locale] → add to `en` and `fr` in the same task; existing i18n tooling (`i18n:create`) can verify keys.

## Migration Plan

No data migration: full-edition builds are byte-for-byte equivalent in behavior (`__APP_EDITION__` folds to `"full"`, every gate folds away). Rollback = stop producing student packages; nothing persisted by student builds matters to the full edition (separate app identity). Shipping: teacher runs `node scripts/pack.js student make` with `GONETEM_SERVER_URI` set.

## Open Questions

None blocking. Badge wording ("Student edition") and exact app-name strings can be tweaked without touching specs or task breakdown.
