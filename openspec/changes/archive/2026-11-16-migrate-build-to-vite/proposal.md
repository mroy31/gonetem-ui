# Proposal

## Why

The webpack-based build (Electron Forge `plugin-webpack`) makes dev startup slow (cold webpack build of main + renderer on every `yarn start`), requires maintaining four webpack config files plus `scripts/forge-webpack.js` — a workaround solely to match the Forge plugin's pinned webpack copy — while tests already run on Vite via Vitest. Moving the app build to Vite (`@electron-forge/plugin-vite`) gives a fast dev server with React Fast Refresh, deletes the version-pinning hack, and converges the whole project on one transform pipeline.

## What Changes

- Replace `@electron-forge/plugin-webpack` with `@electron-forge/plugin-vite` in `forge.config.js`; keep all three makers (squirrel, zip, deb) and `extraResource` untouched.
- Add Vite configs for the three build targets (main, preload, renderer), reusing `scripts/edition-env.js` unchanged: edition/server-URI injection moves from `DefinePlugin` to Vite `define`, keeping the same build-failure behavior for invalid or missing values.
- Adapt `src/index.ts` window loading from the webpack-injected `MAIN_WINDOW_WEBPACK_ENTRY` / `MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY` constants to their Vite equivalents (dev server URL in dev, packaged entry in prod).
- Point `package.json` `main` at the new build output directory and keep the public scripts (`start`, `start-student`, `package`, `make`, `publish`) working identically, including the `GONETEM_EDITION` / `GONETEM_SERVER_URI` env contract.
- Remove all webpack configuration (`webpack.main.config.js`, `webpack.renderer.config.js`, `webpack.rules.js`, `webpack.plugins.js`, `scripts/forge-webpack.js`) and the webpack-only devDependencies (loaders, `fork-ts-checker-webpack-plugin`, `dotenv-webpack`, webpack itself); add `@electron-forge/plugin-vite` and `@vitejs/plugin-react`.
- Live type checking during dev (previously `fork-ts-checker-webpack-plugin`) is replaced by an explicit `yarn typecheck` script (`tsc --noEmit`). Assumption: running type checks in a separate script rather than re-adding an in-dev error overlay.

No externally observable app behavior changes: both editions build, launch, package, and fail exactly as the existing `app-editions` spec requires; `yarn lint` and `yarn test` are unaffected.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. This is a pure build-tooling migration: no spec-level behavior changes. `app-editions`, `verification-infrastructure`, and all other capabilities keep their current requirements; the migration must preserve them, not alter them. The change therefore sets `skip_specs: true` in `.openspec.yaml`.

## Impact

- Build config: `forge.config.js` (plugin swap), new `vite.*.config.ts` files, deletion of the five webpack files.
- `src/index.ts`: entry-constant declarations and window URL/preload loading (small, contained change).
- `package.json`: `main` field, scripts (add `typecheck`), devDependencies churn.
- Build output moves from `out/.webpack/` (webpack plugin's output dir) to the Vite plugin's output dir; `.gitignore`/CI references checked during implementation.
- Unaffected: makers, `extraResource` (`./app`), i18n resource loading via `process.resourcesPath`, proto generation scripts, Vitest setup.
