# Design

## Context

`tsc --noEmit` under 6.0.3 reports 10 errors in 9 sites (inventory in proposal.md); under 5.9.3 the tree is green except the now-unused `@ts-expect-error` in `ConsolePanel.tsx`. Two of the eight `catch` sites are special: `TopologyEditorPanel.tsx` reads `e.mark` (a js-yaml `YAMLException` property, not on `Error`), and `src/api/client.ts` sites are in `main`-process TLS setup where the thrown value can be an `Error` or a string-ish rejection. The repo already practices explicit null-safety (`fix-null-safety`). Toolchain facts (verified): typescript-eslint 8.73.0 peers `typescript >=4.8.4 <6.1.0`; vite/vitest transpile via esbuild and do not consume the project's TypeScript at all.

## Goals / Non-Goals

**Goals:**
- One pinned compiler (6.0.3) behind gate, lint, and (per documented setup) editor.
- Zero `tsc --noEmit` errors under 6.0.3 without weakening any call site's error reporting.

**Non-Goals:**
- TS 7.x adoption (native rewrite; blocked until typescript-eslint peers admit it).
- Typechecking `vite.*.config.mts` / `vitest.config.mts` (user-confirmed clean; keeps gate scope unchanged).
- Enabling `strict: true` or other new compiler flags — only the version changes.

## Decisions

**D1 — Target 6.0.3, not 7.0.2.** 6.0.x is the JS-API bridge line; typescript-eslint's peer range (`<6.1.0`) admits it and excludes 7. Choosing `latest` (7) would break type-aware linting, the gate's only non-trivial TS-API consumer. Revisit 7 when typescript-eslint's peer range covers it; record this as the unfreeze policy in AGENT.md.

**D2 — Reverse the frozen-set entry rather than delete silently.** AGENT.md's frozen list drops "TypeScript 5.x" and states the new rule (single pinned version shared by all TS tooling; 6.0.x pinned; TS 7 deferred on the typescript-eslint condition). The archived `upgrade-dependencies-with-tests` design stays untouched (archive is immutable); the reversal and its rationale (loaders — the original blocker — were deleted by the Vite migration) live here.

**D3 — Narrow `catch (err: unknown)` sites with `instanceof Error`, no `any` casts, no tsconfig opt-out.** `useUnknownInCatchVariables: false` would restore TS5 ergonomics in one line but re-opens the hole the fix-null-safety change closed, and the editor already treats these as errors. Pattern per site: `err instanceof Error ? err.message : String(err)` (message extraction); `TopologyEditorPanel` gets a local structural guard for the js-yaml shape (`{ message: string; mark?: { position: number } }`) because `YAMLException` property access (`e.mark`) isn't on `Error`. Alternative (shared `errorMessage(): string` helper in a utils module) rejected: 8 sites in two shapes are cheaper to read inline than a new cross-module dependency.

**D4 — Ambient `declare module "*.css";` in `types/` (alongside `images.d.ts`), and delete the `@ts-expect-error`.** One declaration covers both CSS side-effect imports (app.css, xterm css) and is version-symmetric: under 5.9 it's inert, under 6.0.3 it satisfies TS2882 — unlike the directive, which is unused under 5.9 (TS2578) and thus breaks whichever gate runs the other compiler. Alternatives: per-import directives (asymmetric, fails 5.9) and `allowArbitraryExtensions` + a `.d.css.ts` convention (ceremony for zero benefit — CSS imports are side-effect-only).

**D5 — i18next-fs-backend `.services` gap fixed at the one site in `src/i18n/renderer.ts`.** The custom IPC `BackendModule` stores `services` on `this`; the library type omits it. A local typed cast (`(this as BackendModule & { services: ... })`) or module augmentation of `BackendModule` — augmentation preferred if the cast would appear more than once; it doesn't (single file), so the minimal local augmentation of the interface via `declare module "i18next"` is the preferred concrete form to keep future sites type-safe.

## Risks / Trade-offs

- [typescript-eslint accepts 6.0.3 per peer range but is not TS6-API-tested at this exact combo] → `yarn lint` gate exercises the parser over all typed sources; failures surface immediately in CI-equivalent local gate.
- [TS6 surfaces errors the 5.9-based tests never saw] → test suite runs unchanged under esbuild (TS-agnostic); behavioral risk limited to the 9 edited sites, each a throw/narrow path — covered by existing handler tests for the api/* files.
- [Editor drifts back to bundled TS after VSCode updates] → AGENT.md documents workspace-version selection; the gate catches divergence regardless.
- [5.9-only CI images or contributor machines pin their own tsc] → gate resolves `tsc` from the project's devDependency; the spec delta pins this as a requirement.

## Migration Plan

Single-commit dependency bump + mechanical fixes; rollback is reverting the commit (no data, no runtime impact — typescript is dev-only). Order: bump → CSS ambient + directive removal → catch narrowing → i18n augmentation → full gate (`lint`, `test`, `typecheck`) → AGENT.md.

## Open Questions

None blocking. (Whether to fold the `yarn typecheck` invocation into `yarn test`'s pretest hook is a convenience choice, not a contract — defer.)
