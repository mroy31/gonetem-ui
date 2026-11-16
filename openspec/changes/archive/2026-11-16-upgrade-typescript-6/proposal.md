# Proposal

## Why

The editor's built-in TypeScript (6.x, matching VSCode) and the pinned gate compiler (5.9.3) disagree: tsc 5.9.3 reports only an unused `@ts-expect-error`, while TS 6.0.3 reports 10 real errors (catch-variable `unknown` ×8, side-effect CSS import ×1, i18next-fs-backend `.services` gap ×1, plus the directive that must go). Developers see errors the gate never catches, and a fix that satisfies one compiler breaks the other. VSCode ships TS 6.x, and the team wants editor and gate on the same compiler.

The "TypeScript 5.x" entry in the frozen dependency set (`upgrade-dependencies-with-tests` design) rejected 6/7 because of "native rewrite, loaders not ready" — every webpack loader was deleted by the Vite migration, and the remaining TS-API consumers are `tsc` itself and typescript-eslint, whose current peer range (`>=4.8.4 <6.1.0`) admits 6.0.3. The freeze rationale no longer applies.

## What Changes

- Upgrade `typescript` devDependency from exact pin `5.9.3` to exact pin `6.0.3` (TS 6 bridge line; 7.x deferred until typescript-eslint's peer range covers it — out of scope).
- Fix the 10 TypeScript 6.0.3 errors surfaced by `tsc --noEmit`:
  - 8 `catch (err)` sites where `err` is now `unknown` (api/client ×2, api/i18n, api/project, api/topology, ProjectPanel, TopologyEditorPanel ×2) — narrow properly rather than cast to `any`.
  - Side-effect CSS imports (`src/renderer.ts` `./app.css`; `ConsolePanel.tsx` xterm css): add an ambient `declare module "*.css"` alongside the existing `types/images.d.ts` pattern and remove the `@ts-expect-error` directive.
  - `src/i18n/renderer.ts`: `services` property on the i18next `BackendModule` typing gap — typed local augmentation or cast at the one site.
- Make the editor and the gate one compiler: after the bump, VSCode's workspace TypeScript version (6.0.3) is selected; documented in AGENT.md.
- Unfreeze deliberately: remove "TypeScript 5.x" from AGENT.md's frozen set, record the reversal of the archived decision (rationale mooted by the Vite migration), and note the TS 7 deferral condition.
- `vite.*.config.mts` / `vitest.config.mts` stay out of typecheck scope (user-confirmed clean in the editor; observed no errors there).

## Capabilities

### New Capabilities

(none)

### Modified Capabilities

- `verification-infrastructure`: adds a static type-check gate requirement (`yarn typecheck` passes on conforming trees, fails on type errors) — this gate exists in practice (added with the Vite migration) but was never spec'd — and a single-source-of-truth requirement that the TypeScript compiler version is pinned in `package.json` and shared by all TS-API tooling (typecheck, lint type-aware parsing, editor).

## Impact

- `package.json` / `yarn.lock`: `typescript` 5.9.3 → 6.0.3 (devDependency, exact pin).
- Source fixes in 8 files (9 error sites + directive removal) + one ambient declaration file under `types/`.
- `AGENT.md`: frozen-set entry removed/replaced with the alignment policy and TS 7 deferral note.
- No runtime behavior change: typescript is dev-only; vite/vitest transpile via esbuild and are TS-version-agnostic; typescript-eslint 8.72/8.73 peer range admits 6.0.3.
- No spec changes to any functional capability.
