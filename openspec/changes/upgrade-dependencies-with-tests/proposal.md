# Proposal

## Why

The dependency stack is ~2.5 years behind (mid-2024 pins): Electron 31 is long past end of life and receives no security patches, and `yarn lint` is currently broken (ESLint 9 requires flat config while the repo still uses `.eslintrc.json` plus removed CLI flags). There is no test suite, so every upgrade today would have to be verified purely by manual clicking — an unacceptable risk for a 14-major Electron jump. The project needs its safety net back before, and while, it modernizes.

## What Changes

- Update dependencies in deliberate risk-ordered waves (low-risk bumps first, majors after the test net exists):
  - Wave 1: low-risk minor/patch bumps (CodeMirror, heroicons, yaml, tar-stream, @grpc/grpc-js, webpack + loaders, TypeScript 5.9.x, ...)
  - Wave 2: frontend majors — React 19, i18next 26, react-i18next 17, @uiw/react-codemirror, @xterm/* 6.x
  - Wave 3: runtime majors — Electron (latest stable minus one major, currently targeting the 43.x line) and Electron Forge 8.x
  - Wave 4: electron-store major upgrade (v8 -> latest) **or** a deliberate decision to stay on v8 if the ESM migration outweighs the benefit (recorded outcome either way)
  - ESLint flat-config migration + @typescript-eslint 8.x (part of wave 0, since lint must work before risky waves land)
- Introduce automated verification infrastructure alongside the upgrades (vitest): unit/integration tests for the main-process API handlers against fake gRPC clients (no live server), i18n backend tests, a few renderer smoke tests with stubbed `window.api`, all wired to `yarn test` and covered by lint.
- Freeze (deliberately NOT upgraded, with recorded reasons): `vis-network` link-fork and its `vis-data`/`vis-util` peers; `google-protobuf` at 3.21.x (generated-code toolchain mismatch with 4.x); TypeScript 7 (native rewrite, tooling ecosystem not ready); Tailwind frozen within 3.4.x (no v4 CSS-first rewrite in this change).
- Update application code wherever breaking changes require it (React 19 typings, i18next 26 API changes, Forge 8 config, flat-config eslint).
- No user-visible feature behavior changes; UI/UX stays identical.

## Capabilities

### New Capabilities
- `verification-infrastructure`: automated verification the project must provide — working lint over all TypeScript sources, a runnable test suite covering main-process gRPC handler logic and i18n loading without a live server, and renderer smoke tests through the `window.api` boundary.

### Modified Capabilities
<!-- none: no existing capability's spec-level (user-visible) behavior changes; dependency versions are implementation constraints, recorded in design.md -->

## Impact

- `package.json` / `yarn.lock`: near-total dependency refresh except the frozen set
- Build config: `forge.config.js`, webpack configs, `.eslintrc.json` -> flat config, new `vitest.config.ts`
- Source touched where majors break: renderer components (React 19), `src/i18n/*` (i18next 26), `src/api/*` (electron-store decision, Electron 43 APIs), `src/index.ts`
- New test files under `src/` (or a co-located test directory) and test-only dev dependencies (vitest, jsdom, testing-library)
- Untouched: `src/proto/` (generated), `proto/netem.proto`, the `../vis-network-9.1.9` fork, all user-facing functionality defined by the existing 10 specs
