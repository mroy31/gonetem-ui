# AGENT.md

Guidance for AI agents working in this repository.

## Project

gonetem-ui is a cross-platform Electron + React + TypeScript GUI for the
[gonetem](https://github.com/mroy31/gonetem) network emulator. It talks to the
gonetem server over gRPC (protobuf). UI is built with React 18, Tailwind CSS +
DaisyUI, vis-network (topology graph), xterm (consoles), and CodeMirror
(config editor).

## Commands

- Package manager: **yarn** (`yarn install`)
- `yarn start` — run the app in dev mode (Electron Forge + webpack)
- `yarn lint` — eslint over `.ts`/`.tsx`
- `yarn package` / `yarn make` — build/package the app (`out/make` for distributables)
- `./scripts/build-proto.sh` — regenerate gRPC/protobuf code from `proto/*.proto` into `src/proto/`

There is **no test suite**; verify changes with `yarn lint` and by running `yarn start`.

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

- `vis-network` is a local link dependency (`link:./../vis-network-9.1.9`, a
  patched fork outside the repo). It cannot be reinstalled from npm here.
- TypeScript config: `tsconfig.json` with `jsx: react` (classic runtime) and
  path mapping into `types/`.
- Lint config (`.eslintrc.json`): unused vars are errors unless prefixed with `_`.
- This repo uses OpenSpec for change management (`openspec/`); check
  `openspec/specs` and `openspec/changes` when planning non-trivial features.

## Style

Follow existing patterns: functional React components in `src/components/`,
`classnames` for conditional classes, heroicons for icons, and existing IPC /
api-layer conventions when adding features. Do not add comments unless asked.
