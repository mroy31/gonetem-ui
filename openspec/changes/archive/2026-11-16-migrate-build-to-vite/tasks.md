# Tasks

## 1. Dependencies

- [x] 1.1 Add `@electron-forge/plugin-vite` and `@vitejs/plugin-react` to devDependencies with `yarn add -D` and verify installation succeeds.

## 2. Vite build targets and Forge plugin swap

- [x] 2.1 Create `vite.main.config`, `vite.preload.config`, and `vite.renderer.config` per the Forge Vite template (preload `format: "cjs"`, main keeps `electron` external and bundles deps, renderer uses `@vitejs/plugin-react`), each injecting `__APP_EDITION__` / `__STUDENT_SERVER_URI__` through `define` backed by `scripts/edition-env.js`; verify each config evaluates (a build attempt starts without config errors). [Done as `.mts`; main config additionally aliases `i18next-fs-backend` to its CJS entry (ESM build uses top-level await, invalid in CJS output) and inlines `process.env.NODE_ENV` that the main-process resource-path switch relied on.]
- [x] 2.2 Point the renderer HTML entry at `src/renderer.ts` as its module entry and confirm Vite resolves the renderer entry and assets. [Moved `src/index.html` to the project root as `index.html` with `<script type="module" src="/src/renderer.ts">` — required because plugin-vite's renderer root is the project directory (Forge vite template convention).]
- [x] 2.3 Replace `@electron-forge/plugin-webpack` with `@electron-forge/plugin-vite` in `forge.config.js` (same entry points: main `src/index.ts`, renderer `src/renderer.ts`, preload `src/preload.ts`, html entry via renderer root `index.html`) and update `package.json` `main` to the Vite output path (`.vite/build/index.cjs`); verify `yarn start` launches the full-edition app window.
- [x] 2.4 Rework window loading in `src/index.ts` to the Vite pattern (`MAIN_WINDOW_VITE_DEV_SERVER_URL` in dev, `MAIN_WINDOW_VITE_NAME` `loadFile` in prod, preload at `path.join(__dirname, "preload.cjs")` — the plugin emits preload as `preload.cjs` next to the main bundle; there is no `VITE_PRELOAD` constant in plugin-vite 8.0.1); verified in dev via CDP: renderer mounts, `window.api` defined (43 methods), HMR delivers `hmr update` on component edits.

## 3. Edition behavior parity

- [x] 3.1 Run `GONETEM_EDITION=student GONETEM_SERVER_URI=<uri> yarn start` and verify the student behaviors from the `app-editions` spec: student badge shown, no options dialog, autoconnect attempted, gated IPC methods absent from `window.api`. [Verified via CDP: badge "Édition étudiante" rendered, `setOptions`/`writeTopology`/`checkTopology`/`readNodeConfigFiles` all `undefined` (39 vs 43 api keys), autoconnect to baked URI logged at startup, `getOptions` returned baked values (server=127.0.0.1:1, autoconnect, TLS disabled), separate `gonetem-ui-student` user-data-dir.]
- [x] 3.2 Verify fail-fast: `GONETEM_EDITION=bogus yarn start` and student without `GONETEM_SERVER_URI` both exit non-zero with the existing `readEditionEnv` error messages. [Both exit 1 with `Invalid GONETEM_EDITION "bogus"...` / `The student edition requires a non-empty GONETEM_SERVER_URI`.]

## 4. Type checking replacement

- [x] 4.1 Add a `typecheck` script (`tsc --noEmit`) to `package.json`, fix nothing new (baseline must pass), and note the script's role in AGENT.md; verify `yarn typecheck` exits 0 on the migrated tree and flags an intentionally broken type. [Baseline needed `@types/electron-squirrel-startup` (from the Forge vite template) for the new static import; broken-type probe flagged, restored, clean.]

## 5. Webpack removal

- [x] 5.1 Delete `webpack.main.config.js`, `webpack.renderer.config.js`, `webpack.rules.js`, `webpack.plugins.js`, and `scripts/forge-webpack.js`, and remove webpack-only devDependencies (`ts-loader`, `fork-ts-checker-webpack-plugin`, `dotenv-webpack`, `file-loader`, `node-loader`, `css-loader`, `style-loader`, `postcss-loader`, `@vercel/webpack-asset-relocator-loader`, `webpack`); verify `yarn install`, `yarn lint`, `yarn test`, and `yarn start` all succeed afterward. [Also dropped the dead `iframe#webpack-dev-server-client-overlay` rule from `src/app.css` and removed the now-inapplicable asset-relocator pin from AGENT.md.]
- [x] 5.2 Grep the repo for stale `.webpack` references (package.json, `.gitignore`, docs, scripts) and update them; verify no build output or ignore rule still points at the webpack directory. [`.gitignore` and eslint ignores switched `.webpack/` → `.vite/`; stale `.webpack/` output dir deleted; only explanatory comments about the old build remain.]

## 6. Integration verification

- [x] 6.1 Verify production builds: `yarn package` for full and student editions, `yarn make` (at least the darwin zip maker), and launch the packaged app once per edition, confirming the `extraResource` i18n resources load from `process.resourcesPath`. [Full: packaged app launched, mounted, 43 api keys, translated UI from `process.resourcesPath`/app/localization, live gRPC connect showed server version "0.6.99". Student: packaged via `scripts/pack.js`, badge rendered, 39 api keys (gated methods absent), autoconnect used baked URI. `yarn make` produced `out/make/zip/darwin/arm64/gonetem-ui-darwin-arm64-0.6.0.zip`.]
- [x] 6.2 Run the full gate on the final tree: `yarn lint`, `yarn test`, `yarn typecheck`, plus one connected smoke flow (server connect + a node console open) in dev, confirming gRPC bundling under Rollup did not regress the `server-connection` behavior. [Gates pass (lint clean; 23 files / 136 tests; typecheck 0). Dev live: connect + `listProjects` OK against gonetem-server (0.6.99); packaged full also showed "Connecté: 0.6.99". Node console: manual smoke against a live server passed (user-confirmed); the console path is pure-JS duplex gRPC over `@grpc/grpc-js` (`client.nodeExec()`), same primitives as the verified unary calls.]
