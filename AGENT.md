# AGENT.md

Guidance for AI agents working in this repository.

## Project

gonetem-ui is a cross-platform Electron + React + TypeScript GUI for the
[gonetem](https://github.com/mroy31/gonetem) network emulator. It talks to the
gonetem server over gRPC (protobuf). UI is built with React 19, Tailwind CSS +
DaisyUI, Cytoscape.js (topology graph), xterm (consoles), and CodeMirror
(config editor).

## Commands

- Package manager: **yarn** (`yarn install`). Always run Forge through yarn
  (`yarn start`/`yarn package`/`yarn make`), never `npx electron-forge` — Forge's
  system check detects the package manager from the npm user-agent and fails under npx.
- `yarn start` — run the app in dev mode (Electron Forge + webpack)
- `yarn lint` — eslint (flat config, `eslint.config.mjs`) over `.ts`/`.tsx`
- `yarn test` / `yarn test:watch` — vitest (node project: `src/**/*.test.ts`,
  jsdom project: `src/**/*.test.tsx`); `vitest.config.mts`
- `yarn package` / `yarn make` — build/package the app (`out/make` for distributables)
- `./scripts/build-proto.sh` — regenerate gRPC/protobuf code from `proto/*.proto` into `src/proto/`

Verify changes with `yarn lint` + `yarn test` (+ `yarn start` for UI behavior).

## Architecture

- Electron main process: `src/index.ts`; main-process logic lives in `src/api/`
  (gRPC client, projects, topology, nodes, consoles, options/store).
- Security boundary: `src/preload.ts` exposes a typed `contextBridge` API
  (`window.api`) built on `ipcRenderer.invoke`; renderer code (`src/app.tsx`,
  `src/components/`) must only reach the main process through it. Global API
  types are declared in `types/window.d.ts`.
- IPC handlers in `src/api/*` are registered in `src/index.ts`; add new IPC
  channels in all three places (handler, preload, window.d.ts).
- `src/proto/` is **generated code** — never edit by hand; edit `proto/netem.proto`
  and run `./scripts/build-proto.sh`.
- Translations: i18next; locales under `app/localization/locales`, wired in
  `src/i18n/main.ts` (main) and `src/i18n/renderer.ts` (renderer).
- `dev/` holds scratch/experimental files; `out/`, `node_modules/`, generated
  `src/proto/*` are build artifacts.

## Gotchas

- Frozen dependency set (do not upgrade, see
  `openspec/changes/upgrade-dependencies-with-tests/design.md`): `google-protobuf` 3.21.x,
  TypeScript 5.x, Tailwind 3.4.x, daisyUI 4.x,
  `@vercel/webpack-asset-relocator-loader` 1.7.3 (1.8+ injects `__dirname`
  into the sandboxed preload and throws). `package.json` `resolutions` keep a
  single copy of `@codemirror/*` + `@lezer/common` (yarn v1 does not dedupe
  them; duplicates break CodeMirror's instanceof checks at runtime).
- TypeScript config: `tsconfig.json` with `jsx: react` (classic runtime; test
  files need `import React`), `moduleResolution: bundler` (ESM-only deps like
  electron-store v12). Global API types are ambient via `include` of `types/`.
- Lint config (`eslint.config.mjs`, flat): unused vars are errors unless
  prefixed with `_`.
- Electron main is sandboxed with `contextIsolation`; the preload/webpack bundle
  must stay browser-safe (no bare `__dirname`/`fs` in renderer or preload).
- This repo uses OpenSpec for change management (`openspec/`); check
  `openspec/specs` and `openspec/changes` when planning non-trivial features.

## Style

Follow existing patterns: functional React components in `src/components/`,
`classnames` for conditional classes, heroicons for icons, and existing IPC /
api-layer conventions when adding features. Do not add comments unless asked.
