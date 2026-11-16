# Tasks

## 1. Dependency bump

- [x] 1.1 Pin `typescript` `6.0.3` (exact) in `package.json` devDependencies, run `yarn install`; verify `yarn tsc --version` prints 6.0.3 and `yarn why typescript` shows a single copy.
- [x] 1.2 Run `yarn typecheck` and confirm the failure set is exactly the 6.0.3 baseline: 8×TS18046 (api/client ×2, api/i18n, api/project, api/topology, ProjectPanel, TopologyEditorPanel ×2), 1×TS2882 (`src/renderer.ts` app.css), 1×TS2339 (`src/i18n/renderer.ts` `.services`) — no new error classes; ConsolePanel's directive now suppresses its TS2882, so no TS2578.

## 2. CSS side-effect imports

- [x] 2.1 Add `types/css.d.ts` with an ambient `declare module "*.css";` (mirroring `types/images.d.ts`), and remove the `@ts-expect-error` directive above the xterm CSS import in `src/components/ConsolePanel.tsx`; verify `yarn typecheck` reports neither TS2882 for `src/renderer.ts`/ConsolePanel nor TS2578.

## 3. Catch-variable narrowing (TS18046)

- [x] 3.1 Narrow the five main-process sites with `err instanceof Error ? err.message : String(err)` where the message is consumed: `src/api/client.ts` (~34, ~88), `src/api/i18n.ts` (~88), `src/api/project.ts` (~151), `src/api/topology.ts` (~198); verify `yarn typecheck` shows no TS18046 in `src/api` and `yarn test` passes (existing handler specs cover these paths).
- [x] 3.2 Narrow the three renderer sites: `src/components/ProjectPanel.tsx` (~150) with the message pattern; `src/components/TopologyEditorPanel.tsx` (~66, ~74) with a local structural guard for the js-yaml throw shape (`{ message: string; mark?: { position: number } }`) per design D3 — no `any` casts; verify `yarn typecheck` shows no TS18046 in `src/components` and `yarn test` passes.

## 4. i18next backend typing gap (TS2339)

- [x] 4.1 In `src/i18n/renderer.ts`, resolve the `services`-on-`BackendModule` gap via a `declare module "i18next"` augmentation carrying the stored services type (design D5), keeping the runtime behavior identical; verify `yarn typecheck` reports no TS2339 and the localization tests in `yarn test` pass. [Deviation from D5's preferred form: i18next 26 ships `index.d.mts` as an ESM façade re-exporting `export type BackendModule = ...` aliases, so a `declare module "i18next"` interface augmentation cannot merge under either resolution mode (verified by probes: CJS-mode .d.ts shadowed the whole module; ESM-mode hit the façade alias). Used D5's named alternative — local typed cast via an explicit `this` parameter, same single site, zero runtime change.]

## 5. Documentation and unfreeze record

- [x] 5.1 Update `AGENT.md`: drop "TypeScript 5.x" from the frozen dependency set; add the single-pinned-compiler policy (6.0.3; gate resolves tsc from devDependencies), the VSCode workspace-version selection step, and the TS 7 deferral condition (until typescript-eslint peer range admits it), noting the original freeze rationale was mooted by the Vite migration; verify `rg "TypeScript 5.x" AGENT.md` has no match and the commands section still reflects reality.

## 6. Integration verification

- [x] 6.1 Full gate on the final tree: `yarn lint`, `yarn test`, `yarn typecheck` all exit 0 under 6.0.3, and one `yarn start` dev launch confirms the renderer still mounts and styles apply (CSS import path unchanged at runtime); confirm editor parity by selecting the workspace TypeScript version in VSCode and seeing zero Problems in the previously failing files. [Gates: lint 0, test 0 (23 files / 136 tests), typecheck 0 under 6.0.3. CDP dev launch: renderer mounted in `#app-container` (8 buttons), 2 stylesheets / 96 CSS rules applied, 43 window.api keys (full edition). VSCode workspace-version selection confirmed clean by user.]
