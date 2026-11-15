# Tasks

## 1. Dependencies

- [ ] 1.1 Add `@electron-forge/plugin-vite` and `@vitejs/plugin-react` to devDependencies with `yarn add -D` and verify installation succeeds.

## 2. Vite build targets and Forge plugin swap

- [ ] 2.1 Create `vite.main.config`, `vite.preload.config`, and `vite.renderer.config` per the Forge Vite template (preload `format: "cjs"`, main keeps `electron` external and bundles deps, renderer uses `@vitejs/plugin-react`), each injecting `__APP_EDITION__` / `__STUDENT_SERVER_URI__` through `define` backed by `scripts/edition-env.js`; verify each config evaluates (a build attempt starts without config errors).
- [ ] 2.2 Point `src/index.html` at `src/renderer.ts` as its module entry and confirm Vite resolves the renderer entry and assets (no webpack `file-loader` references remain needed).
- [ ] 2.3 Replace `@electron-forge/plugin-webpack` with `@electron-forge/plugin-vite` in `forge.config.js` (same entry points: main `src/index.ts`, renderer `src/renderer.ts`, preload `src/preload.ts`, html `src/index.html`) and update `package.json` `main` to the Vite output path; verify `yarn start` launches the full-edition app window.
- [ ] 2.4 Rework window loading in `src/index.ts` to the Vite pattern (`MAIN_WINDOW_VITE_DEV_SERVER_URL` in dev, `MAIN_WINDOW_VITE_NAME` `loadFile` in prod, `VITE_PRELOAD` preload path); verify in dev that the renderer mounts, `window.api` is defined, and Fast Refresh applies an edit without a full reload.

## 3. Edition behavior parity

- [ ] 3.1 Run `GONETEM_EDITION=student GONETEM_SERVER_URI=<uri> yarn start` and verify the student behaviors from the `app-editions` spec: student badge shown, no options dialog, autoconnect attempted, gated IPC methods absent from `window.api`.
- [ ] 3.2 Verify fail-fast: `GONETEM_EDITION=bogus yarn start` and student without `GONETEM_SERVER_URI` both exit non-zero with the existing `readEditionEnv` error messages.

## 4. Type checking replacement

- [ ] 4.1 Add a `typecheck` script (`tsc --noEmit`) to `package.json`, fix nothing new (baseline must pass), and note the script's role in AGENT.md; verify `yarn typecheck` exits 0 on the migrated tree and flags an intentionally broken type.

## 5. Webpack removal

- [ ] 5.1 Delete `webpack.main.config.js`, `webpack.renderer.config.js`, `webpack.rules.js`, `webpack.plugins.js`, and `scripts/forge-webpack.js`, and remove webpack-only devDependencies (`ts-loader`, `fork-ts-checker-webpack-plugin`, `dotenv-webpack`, `file-loader`, `node-loader`, `css-loader`, `style-loader`, `postcss-loader`, `@vercel/webpack-asset-relocator-loader`, `webpack`); verify `yarn install`, `yarn lint`, `yarn test`, and `yarn start` all succeed afterward.
- [ ] 5.2 Grep the repo for stale `.webpack` references (package.json, `.gitignore`, docs, scripts) and update them; verify no build output or ignore rule still points at the webpack directory.

## 6. Integration verification

- [ ] 6.1 Verify production builds: `yarn package` for full and student editions, `yarn make` (at least the darwin zip maker), and launch the packaged app once per edition, confirming the `extraResource` i18n resources load from `process.resourcesPath`.
- [ ] 6.2 Run the full gate on the final tree: `yarn lint`, `yarn test`, `yarn typecheck`, plus one connected smoke flow (server connect + a node console open) in dev, confirming gRPC bundling under Rollup did not regress the `server-connection` behavior.
