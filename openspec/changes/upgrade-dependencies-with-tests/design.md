# Design

## Context

See proposal.md - Why. Additional constraints from codebase inspection:

- Stack today: Electron 31.0.2 / Forge 7.4, React 18.3, TS 5.5, ESLint 9.5 with a legacy `.eslintrc.json` (`yarn lint` currently fails: `--ext` removed in flat-config mode), Tailwind 3.4, yarn 1.22.
- No test suite exists; the verification story is lint + manual `yarn start`.
- `src/api/*` handlers are thin `CLIENT == null` guards around inner functions that receive the `NetemClient` as a parameter (e.g. `src/api/topology.ts`) — the seam needed for test doubles already exists; no refactor is required to make handlers testable.
- `src/api/options.ts` imports `electron-store` v8 (CJS); v9+ is ESM-only, which interacts with the webpack main-process build.
- `vis-network` is `link:./../vis-network-9.1.9` — a vendored copy of the 9.1.9 dist with one hand edit (`lib/network/modules/components/Edge.js`); `vis-data`/`vis-util` are its runtime peers and must stay at the versions 9.1.9 expects.
- `src/proto/` is generated from `proto/netem.proto` with `grpc-tools` + `grpc_tools_node_protoc_ts`, targeting the `google-protobuf` 3.x runtime; the generated code must keep working unchanged.

## Goals / Non-Goals

**Goals:**
- A green `yarn lint` and `yarn test` before any high-risk dependency wave lands, staying green after each wave.
- Dependencies current except a documented freeze list.
- Every wave independently revertable (separate commits, tagged checkpoints).

**Non-Goals:**
- No behavior/UX changes; the 10 existing capability specs stay untouched.
- No test coverage targets beyond the seams the spec names (handler logic, i18n, renderer smoke). No E2E/Playwright, no CI setup in this change.
- No vis-network fork modernization or Cytoscape migration (tracked separately in TODO.md).

## Decisions

**D1: Wave-ordered upgrade instead of `yarn upgrade --latest`.**
Low-risk minor/patch bumps first, majors one cluster at a time (frontend majors, then Electron/Forge, then electron-store), each wave ending with `yarn lint` + `yarn test` + a short manual smoke run. Alternative (single big-bang bump) rejected: with ~14 Electron majors and 4 framework majors crossed at once, failures become undebuggable.

**D2: Wave 0 = tooling safety net, before any dependency wave.**
Migrate ESLint to flat config (`eslint.config.mjs`) with typescript-eslint 8.x now — this both fixes the already-broken `yarn lint` and pre-pays for ESLint 10 later. Add vitest with two projects (node environment for `src/api` + `src/i18n` tests, jsdom for renderer tests). Vitest over Jest: native TS/ESM support, no babel config, cheap jsdom project. Tests are co-located (`src/**/*.test.ts(x)`) and included in lint scope.

**D3: Test doubles via `vi.mock`, no production refactor.**
Handler tests mock `src/api/client` (fake `CLIENT` + fake `NetemClient` callbacks) and the `electron` module; renderer tests provide a `window.api` stub and `vi.mock` the `vis-network` import. Chosen over exporting the inner functions or dependency-injecting through constructor: zero churn to production code, and the seam already exists.

**D4: Electron target = stable minus one major (43.x line), Forge 8.x.**
Jumping to the just-released Electron 45 + Forge 8.0.1 puts us on the least-proven combination. 43.x is mature and within Electron's security-support window. Alternative (45) rejected for now; bumping minors later is cheap.

**D5: electron-store treated as a gated decision, not a blind bump.**
Attempt the v12 ESM migration (webpack main bundle + `environment: { esVersion: ... }` or dynamic-import usage). If the build fights back, consciously stay on v8 and record the outcome in tasks.md — v8 still works; this is the only dependency allowed to stay old via a recorded decision.

**D6: Freeze list (upgrade-excluded, reasons recorded).**
`vis-network` (link fork), `vis-data` ~7.1.x, `vis-util` ~5.0.x — pinned to what the fork needs. `google-protobuf` + `@types/google-protobuf` at 3.21.x and the proto toolchain unchanged — 4.x breaks the generated code contract. TypeScript latest 5.x only (not 6/7 — native rewrite, loaders not ready). Tailwind stays within 3.4.x, daisyUI stays 4.x — v4's CSS-first rewrite is a separate change.

## Risks / Trade-offs

- [i18next 23→26 skips two majors with custom backend code in `src/i18n`] → i18n tests written in wave 0 against current behavior, so wave 2 diffs real regressions vs. intended API churn.
- [React 19 strictness (ref props, `@types/react` 19) surfaces late in existing components] → wave 2 is frontend-only, isolated from the Electron wave; type errors are the compiler's job here.
- [Electron 31→43 crosses sandbox/contextIsolation default changes] → the app already uses preload + contextBridge (compatible architecture); manual smoke checklist per wave covers console/graphics regressions.
- [Frozen vis trio may conflict with npm peer-resolution during unrelated bumps] → yarn 1 does not hard-fail on peers; if resolution complains, pin with `resolutions` entries.
- [xterm 6 minor API changes break console rendering] → covered by manual smoke step (open console, run command) since xterm is hard to jsdom-test.
- [Co-located test files ship into webpack builds] → webpack rules match `src/**/*.ts` for entry resolution only via imports; test files are never imported, so they are tree-shaken out — verified during wave 0 with a `yarn package` run.

## Migration Plan

1. Wave 0 on a feature branch; checkpoint commit when lint+test green.
2. Waves 1-4 each: dependency bump commit → code fixes → lint/test/manual smoke → checkpoint. Any wave that cannot be stabilized is reverted wholesale and re-planned, since waves are ordered by independence.
3. On completion: `yarn package` + `yarn make` sanity pass on the target platforms the developer uses; record electron-store outcome.

## Open Questions

- Which exact patch of Electron 43.x is current when wave 3 executes (pick latest 43.x at that time).
- Whether `electron-is-dev` / `electron-squirrel-startup` still add value post-upgrade (harmless either way; revisit at wave 3).
