# Design

## Context

See proposal.md - Why. Current build state relevant to the approach:

- Electron Forge 8 drives everything through `@electron-forge/plugin-webpack` with `webpack.main.config.js` (entry `src/index.ts`), `webpack.renderer.config.js` (entry `src/renderer.ts`, preload `src/preload.ts`, html `src/index.html`), plus shared `webpack.rules.js` / `webpack.plugins.js` and the `scripts/forge-webpack.js` version-pinning workaround.
- Edition injection (`__APP_EDITION__`, `__STUDENT_SERVER_URI__` via `DefinePlugin`) is consumed in all three targets: main (`src/ipc.ts`, `src/app-edition-identity.ts`), preload (`src/preload.ts`), renderer (components); globals declared in `types/edition.d.ts`. Values come from `scripts/edition-env.js`, which throws (failing the build) for an invalid edition or a student build without a server URI.
- `src/index.ts` loads the window through the webpack-injected `MAIN_WINDOW_WEBPACK_ENTRY` / `MAIN_WINDOW_PRELOAD_WEBPACK_ENTRY` constants.
- Runtime npm dependencies are pure JS (grpc via `@grpc/grpc-js`, no `.node` binaries in the app's dependency tree). Webpack currently bundles main-process dependencies into the bundle (no externals configured beyond the Forge plugin defaults).
- Tests already run on Vitest (Vite). `fork-ts-checker-webpack-plugin` surfaces type errors during dev.
- Constraints that must survive: `GONETEM_EDITION` / `GONETEM_SERVER_URI` env contract and its build-failure behavior (spec `app-editions`), makers (squirrel/zip/deb), `extraResource: ["./app"]` with `process.resourcesPath` i18n loading, `yarn start|start-student|package|make|publish`, `yarn lint`, `yarn test` (spec `verification-infrastructure`).

## Goals / Non-Goals

**Goals:**

- `yarn start` serves the renderer through a Vite dev server with Fast Refresh; main/preload rebuild incrementally.
- Identical externally observable outcomes: same scripts and env contract, same edition build/fail behavior, same packaged artifacts from the same makers.
- One toolchain family across build and test (Vite/esbuild everywhere); webpack files and the pinning hack deleted.

**Non-Goals:**

- No change to packaging makers, `extraResource`, proto generation, or test setup.
- No reproduction of the in-dev type-error overlay from fork-ts-checker; no adoption of a type-checking Vite plugin.
- No upgrade of Electron Forge major version or React/Tailwind versions as part of this change.

## Decisions

1. **Official `@electron-forge/plugin-vite` over community `electron-vite` or dropping Forge.** The Forge plugin keeps `forge.config.js`, makers, and the `electron-forge` CLI as the single entrypoint, so packaging and CI are untouched; `electron-vite` adds another config abstraction and would still need Forge for makers anyway. Alternative rejected: switching to electron-builder (replaces the whole packaging layer - far beyond scope).

2. **Three Vite configs (`vite.main.config`, `vite.preload.config`, `vite.renderer.config`) wired through the Forge plugin, following the official Forge Vite template.** Mirrors today's three webpack targets 1:1 and keeps the diff to `forge.config.js` small. Renderer config adds `@vitejs/plugin-react` (Fast Refresh); main/preload stay plain TS via esbuild. `src/index.html` becomes the Vite renderer root's entry html, its script tag pointing at `src/renderer.ts`.

3. **Edition injection via Vite `define` in all three configs**, calling the existing `readEditionEnv()` from `scripts/edition-env.js`. Because the module throws at config-evaluation time, an invalid edition or URI-less student build fails before bundling - matching the `app-editions` requirement without new code. Same global names, so `src/edition.ts` and `types/edition.d.ts` are unchanged.

4. **Main process: bundle dependencies, keep `electron` external** - mirroring current webpack behavior (the webpack configs declare no externals). All runtime deps are pure JS, so bundling is viable and avoids the ESM/CJS trap: several main-process deps (`electron-is-dev@3`, `electron-store@12`) are ESM-only and cannot be `require`d as externals from a CJS main. Rollup needs `@rollup/plugin-commonjs`-style handling for CJS deps; the Forge Vite template's main config already applies it.

5. **Preload builds to CJS.** Sandored/preload contexts require `format: "cjs"` in the preload config (Forge Vite template default). `src/index.ts` switches to the template pattern: `MAIN_WINDOW_VITE_DEV_SERVER_URL` in dev, `MAIN_WINDOW_VITE_NAME`-based `loadFile` in prod, `VITE_PRELOAD` as the preload path.

6. **Type checking moves to `yarn typecheck` (`tsc --noEmit`).** fork-ts-checker is webpack-only; rather than add a checker plugin, type checking becomes an explicit script (documented assumption from the proposal). `yarn lint` / `yarn test` stay exactly as the `verification-infrastructure` spec requires them.

7. **Assets and styles:** renderer keeps `postcss.config.js` (Tailwind 4 auto-discovered by Vite); font/asset `file-loader` rules are replaced by Vite's native asset handling from `src/index.html` / imports; `types/images.d.ts` stays as-is. The webpack rules for `.node` files and `@vercel/webpack-asset-relocator-loader` are dropped outright - no runtime native deps exist (verified in `node_modules`).

## Risks / Trade-offs

- [`@grpc/grpc-js` bundles differently under Rollup than webpack (dynamic requires)] → Keep grpc-js bundled (same as today) but verify server connect/RPC flows after migration; if Rollup warns on optional dynamic requires, silence via `rollupOptions`/commonjs settings rather than externalizing (externalizing breaks under CJS main).
- [Dev loses live type errors] → `yarn typecheck` script is added in the same change and noted in AGENT.md/dev docs; worst case is discovering type errors at script time instead of in-dev.
- [Preload format mismatch silently breaking `window.api`] → Explicit smoke check of a console session and one gated IPC call for both editions in the task list.
- [Output dir moves from `.webpack` to the Vite plugin's dir; stale references] → grep for `.webpack` (package.json `main`, `.gitignore`, CI, docs) and update in one pass.
- [Student-edition build failures must still happen at config load, not at runtime] → covered by reuse of `readEditionEnv()`; tasks include running the two failing env combinations and asserting non-zero exit.
- [Trade-off accepted: three small configs duplicate the `define` block] → Extract a tiny shared helper module if duplication feels wrong; not required.

8. **Generated protobuf message modules are converted to ESM at generation time** (`scripts/proto-to-esm.mjs`, run by `build-proto.sh`). protoc emits `netem_pb.js` as CommonJS whose exports appear only through `goog.object.extend(exports, proto.netem)`; webpack tolerated this via runtime interop, but browser-native ESM (Vite dev) and Rollup cannot statically see those exports. The script rewrites the two `require()` lines to imports and the exports merge to explicit `export const` lines harvested from `goog.exportSymbol` names. `netem_grpc_pb.js` stays CommonJS (main-process only, bundled by the commonjs plugin).

## Migration Plan

1. Add Vite configs + plugin swap in `forge.config.js`; adapt `src/index.ts` and `package.json` (`main`, `typecheck` script) while webpack files still exist (webpack plugin removed in the same commit set, so no intermediate state needs to build).
2. Verify dev: `yarn start`, `GONETEM_EDITION=student GONETEM_SERVER_URI=... yarn start`, Fast Refresh, connect flow, one gated-IPC check.
3. Verify prod paths: `yarn package` for both editions, `yarn make` (zip on macOS at minimum), launch packaged app once per edition.
4. Verify gates: `yarn lint`, `yarn test`, `yarn typecheck`; negative edition cases exit non-zero.
5. Delete webpack files, the hack, and webpack-only devDeps; run all of step 2-4 once more.

Rollback: the change is config-scoped and lands as one revertable unit; reverting restores the webpack plugin and files from git history.
