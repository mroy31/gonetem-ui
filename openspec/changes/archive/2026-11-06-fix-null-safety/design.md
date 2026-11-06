# Design

## Context

See proposal.md - Why. Current state facts established by auditing `tsc --noEmit --strictNullChecks` (125 errors across 18 files):

- `types/window.d.ts` defines `ApiResponse` as `{ status: boolean; error?: string }` with `result?: T` added by ~20 extending aliases. Components branch on `res.status` but TypeScript cannot see that success implies `result`.
- `src/api/client.ts` exports `export let CLIENT: NetemClient = null;` - the declared type hides the nullability. 24 use sites live in inner functions of `src/api/*`; handlers guard with `if (CLIENT == null)` at the IPC boundary, but narrowing does not cross function-call boundaries, so typing `CLIENT` honestly surfaces ~24 more errors.
- Generated proto typings are honest: `getStatus(): Status | undefined` (proto3 message fields are optional). ~30 sites chain `res.getStatus().getCode()`. The gRPC callback `response` parameter is NOT optional in the generated `.d.ts`.
- Two real bugs found by the compiler:
  - `src/api/node.ts` `runNodeConsole`: after `consoleCmd` resolves `null`, the `if (cmd == null) resolve(...)` block has no `return`, so execution continues into `spawn(undefined, ...)`, which throws inside the `.then` callback; the outer promise never settles and the request hangs.
  - `src/api/client.ts` `connectToServer`: `return CLIENT.serverGetVersion ? await getVersion() : ...` tests method existence (always truthy); the failure branch is dead code.
- Three sites return `{ status: false }` with no `error`: `src/api/project.ts` (two), `src/api/topology.ts` (one).
- `createClientCredentials` calls `fs.readFile` on `caCert?/clientCert?/clientKey?` which may be `undefined` when TLS is enabled without paths.
- TypeScript does narrow imported mutable bindings after a same-function null guard (verified by probe with the project's tsc 5.5.2).

## Goals / Non-Goals

**Goals:**

- `tsc --noEmit` passes with `strictNullChecks: true` in `tsconfig.json`.
- Zero runtime behavior change except where a fix restores already-specified behavior (terminal-not-found error, certificate-read failure) or is strictly safer (missing status reported as error instead of crashing or silently succeeding).
- Error reporting keeps the existing contract: server-dependent failures resolve with `{ status: false, error }`; nothing rejects into the renderer's `ipcRenderer.invoke` promise.

**Non-Goals:**

- No `useUnknownInCatchVariables` (8 errors) or `noImplicitReturns` (5 errors) fixes; deferred to a follow-up change.
- No regeneration or patching of generated protobuf/gRPC typings.
- No restructuring of the Promise-wrapping boilerplate around gRPC calls beyond what null-safety requires.
- No eslint fixes (`yarn lint` is broken independently: eslint 9 removed the `--ext` flag).

## Decisions

### D1. `ApiResponse` becomes a discriminated union

`types/window.d.ts` aliases become unions, e.g. `StringApiResponse = { status: true; result: string } | ApiResponseErr` with `type ApiResponseErr = { status: false; error: string }`; the payload-less `ApiResponse` success arm is `{ status: true }`.

- Why: fixing ~25 component call sites individually would preserve a type that lies about the runtime contract; the union encodes what implementations already return and removes those errors with zero component edits (existing `res.status` branches do the narrowing).
- Alternative considered: optional-field cleanup per site - rejected as mechanical churn that keeps the lie.
- The three bare `{ status: false }` sites gain explicit messages consistent with their neighbors (project open/save guards and topology case: use the same "already open" / operation-specific wording their surrounding code uses).

### D2. Client singleton: guard at the boundary, pass it down (C2)

`CLIENT` is typed `NetemClient | null`. Each handler keeps its existing `if (CLIENT == null) return { status: false, error: "Not connected to the server" }` guard and then calls the inner function with the narrowed client as a parameter; ~20 inner functions gain a `client: NetemClient` parameter.

- Why: keeps every failure inside the resolve-with-error contract; `ipcMain.handle` turns thrown errors into renderer promise rejections, and renderer call sites never catch rejections.
- Alternative considered: a `requireClient()` that throws - one-line diff per function but converts clean error responses into unhandled rejections (behavior regression). Rejected.
- `CURRENT_PROJECT_ID` stays `string` (initialized to `""`, never null).

### D3. `readStatusError` helper for proto status handling

A helper along `function readStatusError(res: { getStatus(): Status | undefined }): string | null` returns the status error message when the code is `ERROR`, a protocol-error message when `status` is absent, and `null` when the response is OK. Call sites collapse to `const e = readStatusError(res); if (e) return resolve({ status: false, error: errorFmt(e) });`.

- Why: ~30 sites share the same two-step; one helper means one policy. Missing status must never read as success - silent success is the worst failure mode for an emulator UI.
- Alternatives considered: per-site `if (!res.getStatus())` guards (~30 near-copies, drift risk); optional chaining `?.` (compiles but converts malformed responses into success). Both rejected.
- Location: `src/api/utils.ts` alongside existing shared helpers.

### D4. Both real bugs are in scope; their fix is the type fix

- `runNodeConsole`: add the missing `return` after the null-cmd resolve. Behavior change: a request that currently hangs forever now resolves with the terminal-not-found error - exactly what the node-consoles spec's "Terminal executable missing" scenario already requires. The same fall-through shape in `runAllConsoles` and any sibling call sites must be checked for the identical pattern.
- `connectToServer`: delete the dead ternary, call `getVersion()` directly. Behavior-identical (condition is always true).

### D5. Credential path validation in `createClientCredentials`

When `isSecure` is true, validate that all three paths are defined and fail with a clear "TLS enabled but certificate paths are not configured" error before touching the filesystem.

- Why: `fs.readFile(undefined)` would otherwise produce a confusing type/runtime error; the server-connection spec already requires clear certificate failures and this extends it to the misconfiguration edge.
- Alternative considered: making the parameters required and validating in the options UI - larger surface, deferred.

### D6. Staged execution, tsconfig flip first

Implementation order: set `strictNullChecks: true` in `tsconfig.json` first -> D1 union -> consumer/producer follow-through of the union (renderer, preload, api handler return annotations) -> D3 helper + D2 pass-down (the `src/api/*` layer) -> remaining renderer/i18n null fixes (D-cluster: null-initialized refs/state typed honestly, e.g. `Network | null`, `IDisposable | null`; i18n queue typed instead of never-inferred) -> drive the error count to zero and run the smoke pass.

- Why: verified during implementation - TypeScript's discriminated-union narrowing requires `strictNullChecks`; with the flag off, `true`/`false` discriminants widen to `boolean` and the union cannot compile against any consumer, so the flip cannot come last as originally planned. The compiler then guides every subsequent fix with a stable error set.
- Amendment note: this supersedes the original "flip at the end" ordering, adopted after the D1 rewrite produced 48 non-narrowable errors under the flag-off config (user-approved restage).

## Risks / Trade-offs

- [Union conversion changes a global type consumed by main and renderer] -> types-only; grep every `res.result`/`res.error` consumer after the flip; `tsc` is the verifier.
- [D2 widens ~20 inner function signatures] -> churn is mechanical and compiler-checked; behavior unchanged because guards already exist at the same boundaries.
- [A malformed response that today crashes or silently succeeds will now surface as an error toast] -> intended; if the server legitimately sends status-less OK responses the helper policy would need revisiting - the emulator's Go server always sets status, so risk is low.
- [`res.getStatus()` appears in ~30 near-identical callback bodies] -> applying D3 mechanically could miss a site where the surrounding code diverges; review each rewritten block rather than regex-replacing.
- [Component null-init fixes change initial render states] (e.g. `Network | null` instead of `null`-as-`Network`) -> guard clauses must preserve current render behavior; verify visually that loading states match today's output.

## Migration Plan

Single-shot change on a branch; no data or protocol migration. Rollback = revert the branch. Verification: `npx tsc --noEmit` green with the flag on; `yarn start` smoke pass on connect, project open/close, node console (external + embedded), topology run.

## Open Questions

None blocking. The follow-up change for `useUnknownInCatchVariables` + `noImplicitReturns` can be scoped after this one lands.
