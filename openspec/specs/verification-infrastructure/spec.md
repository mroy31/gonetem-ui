# verification-infrastructure Specification

## Purpose

Defines the automated verification the project must provide so dependency upgrades and code changes can be validated without a live emulator server or manual clicking: a working lint gate, a single-command test suite covering main-process handler logic and renderer mounting.

## Requirements

### Requirement: Lint gate runs and passes
The project SHALL provide a lint command (`yarn lint`) that runs successfully on all TypeScript sources, including test files, using the ESLint configuration format supported by the installed ESLint major version.

#### Scenario: Clean sources pass
- **WHEN** `yarn lint` is run on an unchanged, conforming source tree
- **THEN** the command completes with exit code 0

#### Scenario: Violation is reported
- **WHEN** a source file contains a lint violation (e.g. an unused variable not prefixed with `_`)
- **THEN** `yarn lint` exits non-zero and reports the offending file and rule

### Requirement: Single-command automated test suite
The project SHALL provide a test command (`yarn test`) that executes all automated tests and exits non-zero when any test fails.

#### Scenario: Suite passes on healthy code
- **WHEN** `yarn test` is run and all tests pass
- **THEN** the command completes with exit code 0

#### Scenario: Failing test blocks
- **WHEN** at least one test fails
- **THEN** `yarn test` exits non-zero and identifies the failing test

### Requirement: Handler logic verifiable without a live server
The automated tests SHALL cover main-process gRPC handler behavior — success results, server-reported errors, transport errors, and the not-connected state — using a test double for the gRPC client, without requiring a running gonetem server, an Electron display, or network access.

#### Scenario: Success result mapping
- **WHEN** a handler's fake gRPC client responds with a successful status
- **THEN** the test asserts the handler resolves with a success response

#### Scenario: Server error mapping
- **WHEN** a handler's fake gRPC client responds with an error status or a transport error
- **THEN** the test asserts the handler resolves with a failure response carrying a descriptive error message

#### Scenario: Not-connected state
- **WHEN** a handler is invoked while no client connection exists
- **THEN** the test asserts the handler returns the not-connected failure without attempting any RPC

### Requirement: Localization resource loading verified
The automated tests SHALL verify that app localization resources are loadable and that translation lookups resolve for the app's supported locales, including fallback behavior for missing keys.

#### Scenario: Supported locale loads
- **WHEN** localization initialization runs for a supported locale
- **THEN** the tests confirm resource bundles load and known keys translate

#### Scenario: Missing key falls back
- **WHEN** a lookup targets a key absent from a locale
- **THEN** the tests confirm the configured fallback behavior is applied

### Requirement: Renderer smoke verification through the API boundary
The automated tests SHALL render core renderer surfaces with a stubbed `window.api` and the topology graph engine substituted, asserting that key UI elements mount, without loading the real graph library or Electron APIs.

#### Scenario: Application shell mounts
- **WHEN** the application root component is rendered with a stubbed `window.api`
- **THEN** the test confirms the main UI regions are present in the rendered output

#### Scenario: Feature panel mounts
- **WHEN** a core panel (e.g. console or project panel) is rendered with the stubbed API
- **THEN** the test confirms the panel renders its primary controls
