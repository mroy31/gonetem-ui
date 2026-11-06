# Tasks

## 1. Wave 0 - restore the safety net (before any dependency wave)

- [x] 1.1 Create working ESLint flat config (`eslint.config.mjs`) replacing `.eslintrc.json`, covering `.ts`/`.tsx` including test files, keeping the `^_` unused-vars convention; verify `yarn lint` exits 0 on the current tree
- [x] 1.2 Add vitest with node + jsdom projects, `yarn test` script, and tsconfig/lint coverage for `src/**/*.test.ts(x)`; verify `yarn test` runs (0 tests ok) and lint stays green
- [x] 1.3 Write main-process handler tests for the topology/project/node/server API modules using faked `NetemClient` and mocked `electron` + `./client` modules (success, server-error, transport-error, not-connected paths per the spec); verify each spec scenario has a passing test
- [x] 1.4 Write i18n tests for the custom backend: supported-locale load, known-key translation, missing-key fallback; verify against current (pre-upgrade) behavior and record expectations
- [x] 1.5 Write renderer smoke tests: app shell and one core panel mount with stubbed `window.api` and mocked `vis-network`; verify they pass under the jsdom project
- [x] 1.6 Run `yarn package` to confirm test files do not enter webpack bundles; add build-rule exclusions only if they do; verify packaged app boots
- [x] 1.7 Checkpoint commit

## 2. Wave 1 - low-risk minor/patch bumps

- [x] 2.1 Bump runtime deps: `@codemirror/*`, `@uiw/react-codemirror`, `@heroicons/react`, `classnames`, `yaml`, `tar-stream`, `async-mutex`, `buffer`, `@grpc/grpc-js`, `@grpc/proto-loader`; verify `yarn test`, `yarn lint`, `yarn start` (config editor + project ops smoke)
- [x] 2.2 Bump build deps: `webpack`, loaders (`css`, `style`, `file`, `node`, `ts`), `fork-ts-checker-webpack-plugin`, `@vercel/webpack-asset-relocator-loader`, `postcss`/`autoprefixer`/`postcss-loader`, `dotenv-webpack`, `eslint-plugin-import`; TypeScript to latest 5.x (NOT 6/7); verify lint + test + `yarn start` + `yarn package`
- [x] 2.3 Bump `@types/*` (node to 24.x/26.x, others to latest matching runtime majors); fix surfaced type errors; verify lint + test green
- [x] 2.4 Bump `@xterm/*` to 6.x with matching addon versions; fix any console API breakage; verify console behavior manually (`yarn start`, open node console, run commands)
- [x] 2.5 Checkpoint commit

## 3. Wave 2 - frontend framework majors (React 19, i18next 26)

- [x] 3.1 Upgrade `react`, `react-dom`, `@types/react*` to 19; fix type errors (ref-as-prop changes) in `src/components/` and `src/app.tsx`; verify `yarn lint` + `yarn test` green
- [x] 3.2 Upgrade `i18next`, `react-i18next`, `i18next-browser-languagedetector`, `i18next-fs-backend`; adapt `src/i18n/main.ts` and `src/i18n/renderer.ts` to v24-v26 API changes; verify i18n tests from 1.4 still pass (adjusting only intentional API renames) — no adaptation needed, all i18n tests passed unmodified
- [ ] 3.3 Manual smoke: language switch in options, all visible strings render in at least two locales, consoles and config editor unaffected; verify via `yarn start`
- [ ] 3.4 Checkpoint commit

## 4. Wave 3 - runtime majors (Electron + Forge)

- [x] 4.1 Upgrade `electron` to latest stable 43.x at execution time (43.8.7) and all `@electron-forge/*` to 8.x (8.0.1); adapt to Forge 8 (`package.json` main -> `.webpack/main/index.cjs`); verify `yarn start` boots with preload/contextBridge intact
- [x] 4.2 Main-process review: no code changes required (contextIsolation already explicit, stable API surface); `window.api` verified intact via dev boot with renderer console logging — no uncaught renderer errors
- [x] 4.3 Manual smoke against the real gonetem server: connect, project open/close/save with progress UIs, topology edit + run, node console, packet capture, image pull progress; verify no regressions vs. pre-upgrade behavior — confirmed by developer on Electron 43.8.7 + Forge 8.0.1
- [x] 4.4 `yarn make` produces `out/make/zip/darwin/arm64/gonetem-ui-darwin-arm64-0.6.0.zip`; packaged app boots; checkpoint commit

## 5. Wave 4 - electron-store gate

- [x] 5.1 electron-store v12 ESM migration: webpack bundles it into the CJS main bundle warning-free (needed tsconfig `moduleResolution: "bundler"`; the legacy `"*": ["node_modules/*"]` paths wildcard also removed — it shadowed `@types/*` under bundler resolution); options.ts API unchanged (get/set/schema still identical). Packaged app boots reading the existing config; v12 rewrite-on-close verified via mtime with all values preserved; 54 tests green. `src/api/options.ts` itself needed zero code edits
- [x] 5.2 Gate decision: **v12 adopted** (migration workable, no constraint). v8 store file at `~/Library/Application Support/gonetem-ui/config.json` is read/written unchanged by v12 (same userData default); no migration shimming required
- [x] 5.3 Checkpoint commit

## 6. Integration checks

- [x] 6.1 Full suite green on final tree: `yarn lint`, `yarn test` (54), `yarn package`, `npx tsc --noEmit`; frozen-set audit passed (vis-network link, vis-data ~7.1.9, vis-util ~5.0.7, google-protobuf ~3.21.2, TypeScript 5.9.3, Tailwind ^3.4.19, daisyui ~4.12.24, relocator 1.7.3, CodeMirror resolutions intact). Audit also caught a phantom `js-yaml` import (undeclared, resolving via eslint's tree) — declared explicitly at the already-bundled 4.1.0
- [x] 6.2 AGENT.md updated: React 19, yarn-vs-npx Forge note, `yarn test`/vitest, flat eslint config, moduleResolution bundler, frozen-set + relocator/CodeMirror-resolutions gotchas, sandbox note; all documented commands were run green on this tree

## Workflow follow-up

- Archive the change after review requirements are satisfied.
- Verify the archived result.
