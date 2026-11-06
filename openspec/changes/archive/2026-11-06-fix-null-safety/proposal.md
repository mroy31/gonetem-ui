# Proposal

## Why

The project compiles clean only because `tsconfig.json` leaves `strictNullChecks` off. With the flag on, the codebase shows 125 null-safety errors, and the audit exposed two real runtime bugs plus several unchecked assumptions (nullable singleton client, optional proto status fields, optional API results). Enabling `strictNullChecks` makes the existing null handling honest and lets these bugs be fixed as part of making the build pass.

## What Changes

- Convert the `ApiResponse` family in `types/window.d.ts` to discriminated unions: success arm requires `result`, failure arm requires `error`. Types-only; the runtime shape implementations already return one arm.
- Type the gRPC client singleton as `NetemClient | null` and pass the narrowed client down from IPC handler guards into inner functions (no throw-based accessor).
- Add a shared `readStatusError` helper for proto responses; a response missing its `status` message is treated as a protocol error, never as silent success.
- Fix the bug in `src/api/node.ts` where a missing terminal executable resolves the request and then spawns anyway (currently the promise hangs after the resolve falls through); after the fix the request completes with the already-specified terminal-not-found error.
- Remove the dead ternary in `src/api/client.ts` that tests method existence instead of calling it; the always-true branch makes the removal behavior-identical.
- Add explicit error messages to the three bare `{ status: false }` returns and runtime validation in `createClientCredentials` for TLS enabled with missing certificate paths.
- Fix remaining null-safety errors in renderer components and i18n state (null-initialized refs/state, never-inferred arrays).
- Flip `strictNullChecks: true` in `tsconfig.json`. `useUnknownInCatchVariables` and `noImplicitReturns` are deferred to a follow-up change.

## Capabilities

### New Capabilities

None.

### Modified Capabilities

None. The observable behavior deltas are bug fixes bringing the implementation into line with existing requirements (node-consoles "Terminal executable missing", server-connection "Certificates unreadable"); the rest is type-level with no runtime change. Per the spec-delta contract, this change sets `skip_specs: true`.

## Impact

- `types/window.d.ts`: `ApiResponse` union conversion (affects every renderer call site's narrowing, no code change needed at most sites).
- `src/api/client.ts`, `src/api/console.ts`, `src/api/node.ts`, `src/api/project.ts`, `src/api/topology.ts`, `src/api/server.ts`: client pass-down (~20 inner functions), status helper call sites, credential validation.
- `src/api/i18n.ts`, `src/i18n/renderer.ts`: null/never state fixes.
- `src/components/*` (~12 files) and `src/app.tsx`: null-init state, refs, and narrowing fixes.
- `tsconfig.json`: `strictNullChecks: true`.
- No dependency, protocol, or persisted-data changes.
