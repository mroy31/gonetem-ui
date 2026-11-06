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
- [ ] 2.4 Bump `@xterm/*` to 6.x with matching addon versions; fix any console API breakage; verify console behavior manually (`yarn start`, open node console, run commands)
- [ ] 2.5 Checkpoint commit

## 3. Wave 2 - frontend framework majors (React 19, i18next 26)

- [ ] 3.1 Upgrade `react`, `react-dom`, `@types/react*` to 19; fix type errors (ref-as-prop changes) in `src/components/` and `src/app.tsx`; verify `yarn lint` + `yarn test` green
- [ ] 3.2 Upgrade `i18next`, `react-i18next`, `i18next-browser-languagedetector`, `i18next-fs-backend`; adapt `src/i18n/main.ts` and `src/i18n/renderer.ts` to v24-v26 API changes; verify i18n tests from 1.4 still pass (adjusting only intentional API renames)
- [ ] 3.3 Manual smoke: language switch in options, all visible strings render in at least two locales, consoles and config editor unaffected; verify via `yarn start`
- [ ] 3.4 Checkpoint commit

## 4. Wave 3 - runtime majors (Electron + Forge)

- [ ] 4.1 Determine current latest stable 43.x Electron at execution time; upgrade `electron` to that version and all `@electron-forge/*` to 8.x; adapt `forge.config.js` and webpack plugin usage to Forge 8 config API; verify `yarn start` boots with preload/contextBridge intact
- [ ] 4.2 Address main-process breaking changes (sandbox/contextIsolation defaults, `session`/`webPreferences` changes) in `src/index.ts`, `src/preload.ts`; verify `window.api` calls work end-to-end in a running app
- [ ] 4.3 Manual smoke against the real gonetem server: connect, project open/close/save with progress UIs, topology edit + run, node console, packet capture, image pull progress; verify no regressions vs. pre-upgrade behavior
- [ ] 4.4 Verify `yarn make` produces installable packages on the developer's platform(s); checkpoint commit

## 5. Wave 4 - electron-store gate

- [ ] 5.1 Attempt electron-store v12 ESM migration in `src/api/options.ts` under the webpack main build; verify app boots, options persist across restarts, and settings from v8 store file migrate or are re-initializable
- [ ] 5.2 If migration proves unworkable within reasonable effort, record the decision in this file, keep v8, and note the upgrade-blocking constraint; verify `yarn lint`/`yarn test`/`yarn start` green either way
- [ ] 5.3 Checkpoint commit

## 6. Integration checks

- [ ] 6.1 Full suite green on final tree: `yarn lint`, `yarn test`, `yarn package`; frozen-set audit: confirm `vis-network` link, `vis-data` ~7.1.x, `vis-util` ~5.0.x, `google-protobuf` 3.21.x, TypeScript 5.x, Tailwind 3.4.x, daisyUI 4.x remain pinned as designed
- [ ] 6.2 Update AGENT.md gotchas/commands section with the new lint/test workflow and the freeze list; verify the documented commands run as written

## Workflow follow-up

- Archive the change after review requirements are satisfied.
- Verify the archived result.
