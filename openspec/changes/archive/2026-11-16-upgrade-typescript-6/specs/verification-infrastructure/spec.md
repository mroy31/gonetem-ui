# Spec Delta

## ADDED Requirements

### Requirement: Static type-check gate runs and passes
The project SHALL provide a type-check command (`yarn typecheck`, `tsc --noEmit`) that completes with exit code 0 on a conforming source tree and exits non-zero, identifying file and line, on any type error.

#### Scenario: Clean sources pass
- **WHEN** `yarn typecheck` is run on an unchanged, conforming source tree
- **THEN** the command completes with exit code 0

#### Scenario: Type error blocks
- **WHEN** a source file in the gate's scope contains a type error
- **THEN** `yarn typecheck` exits non-zero and reports the offending file and line

### Requirement: Single pinned TypeScript compiler version
The project SHALL pin exactly one TypeScript compiler version in its development dependencies, and every tool that consumes the TypeScript compiler — the type-check gate, type-aware linting, and editor tooling per documented setup instructions — SHALL use that pinned version, so editor diagnostics and the gate cannot diverge by compiler version.

#### Scenario: Gate uses the pinned compiler
- **WHEN** `yarn typecheck` runs
- **THEN** it executes the compiler resolved from the project's pinned development dependency, not a globally or editor-bundled compiler

#### Scenario: Editor can match the pinned compiler
- **WHEN** a developer follows the project's documented editor setup
- **THEN** the editor's TypeScript diagnostics run the same pinned compiler version as `yarn typecheck`
