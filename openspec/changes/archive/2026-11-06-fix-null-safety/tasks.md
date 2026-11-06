# Tasks

## 1. strictNullChecks first (design D6, restaged)

- [x] 1.1 Set `strictNullChecks: true` in `tsconfig.json` and verify `npx tsc --noEmit` reports the expected union + null-safety error set (confirms the flag is active and the compiler will guide the fixes below)

## 2. Response union conversion (D1)

- [x] 2.1 Rewrite the `ApiResponse` family in `types/window.d.ts` as discriminated unions (`ApiResponseErr = { status: false; error: string }`; success arms require `result` where a payload exists) and verify `npx tsc --noEmit` reports no errors originating in `types/window.d.ts` itself
- [x] 2.2 Add explicit error messages to the three bare `{ status: false }` returns in `src/api/project.ts` and `src/api/topology.ts`, matching surrounding wording, and verify each affected handler still type-checks and its error text renders in the UI toast path
- [x] 2.3 Fix union consumer/producer fallout: narrowing in `src/app.tsx`, `src/components/`, `src/index.ts`, `src/i18n/renderer.ts`; ipc cast types in `src/preload.ts`; corrected handler return annotations in `src/api/console.ts`, `src/api/node.ts`, `src/api/topology.ts`, `src/api/client.ts` — and verify `npx tsc --noEmit` shows no remaining TS2339/TS2322 union errors in those files

## 3. API layer: status helper and client pass-down (D3, D2, D4, D5)

- [x] 3.1 Add `readStatusError(res)` to `src/api/utils.ts` returning the error message on `ERROR` code, a protocol-error message when `status` is absent, and `null` when OK, and verify its behavior against all three arms with a temporary check that is removed after passing
- [x] 3.2 Rewrite all `res.getStatus()` chain sites in `src/api/client.ts`, `console.ts`, `node.ts`, `project.ts`, `topology.ts`, `server.ts` to use `readStatusError`, reviewing each block for divergence instead of bulk-replacing, and verify the TS2532 cluster in `src/api/*` clears
- [x] 3.3 Type `CLIENT` as `NetemClient | null` in `src/api/client.ts` and thread the narrowed client as a parameter through the ~20 inner functions in `src/api/*` (handlers keep the not-connected guard), and verify every new null error in `src/api/*` clears with zero throws introduced (grep confirms no `throw` in resolve-contract paths)
- [x] 3.4 Add TLS path validation in `createClientCredentials` (secure mode + any missing path fails with the not-configured message before any `fs.readFile`) and verify a secure-options-without-paths connect attempt reports that error via the response contract, not a rejection
- [x] 3.5 Fix `runNodeConsole` missing `return` after the null-cmd resolve and audit sibling call sites (`runAllConsoles` and others) for the same fall-through shape, and verify an unresolvable terminal command resolves with the terminal-not-found error instead of hanging
- [x] 3.6 Delete the dead `CLIENT.serverGetVersion ?` ternary in `connectToServer`, calling `getVersion()` directly, and verify connect against a live server still returns the version string (or the handshake failure reason when unreachable)

## 4. Renderer and i18n null fixes (D-cluster)

- [x] 4.1 Type null-initialized state and refs honestly in `src/components/ProjectGraph.tsx` and `src/components/ConsolePanel.tsx` (e.g. `Network | null`, `IDisposable | null`) with guards preserving today's render behavior, and verify graph rendering and console tab open/close behave as before in `yarn start`
- [x] 4.2 Fix remaining component null errors in `src/components/` (ProjectPanel, NodeContextMenu, ConfigurationViewerPanel, ProjectToolbar, TopologyEditorPanel, NodeMessagesToast, ProgressProjectSave, ProjectListModal) including regex-match guards and ref typing, and verify `npx tsc --noEmit` shows zero errors in `src/components/`
- [x] 4.3 Fix null/never-inferred state in `src/api/i18n.ts` and `src/i18n/renderer.ts` (queue and timeout state typed explicitly) and verify translation loading and missing-key toasts work as before in `yarn start`

## 5. Final verification

- [x] 5.1 Verify `npx tsc --noEmit` exits 0 with zero errors under the new flag
- [x] 5.2 Smoke-test the full flow with a live server in `yarn start`: connect, project open/save/close, topology run/stop, node config view, external + embedded consoles, terminal-missing error path, and record results

## Workflow follow-up

- Archive the change after review requirements are satisfied.
