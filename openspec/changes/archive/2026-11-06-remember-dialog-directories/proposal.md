# Proposal

## Why

Every file dialog in the app (open project, create project, export topology image) is invoked without a `defaultPath`, so the OS panel opens in a default location (typically the Downloads folder on macOS) instead of where the user was last working. Users who keep project files in a dedicated folder must navigate there on every single open.

## What Changes

- Persist two directories in the existing electron-store app state: `lastProjectDir` and `lastImageExportDir`.
- The open-project and create-project dialogs open in `lastProjectDir`; the topology image save dialog opens in `lastImageExportDir` (keeping `topology.png` as the default filename).
- After a confirmed pick (dialog not canceled), the containing directory of the chosen file is written back to the corresponding key.
- If a stored directory no longer exists (e.g., unmounted volume), the dialog falls back to the user's home directory.

## Capabilities

### New Capabilities

_None._

### Modified Capabilities

- `project-management`: "Open project file" and "Create empty project" gain the requirement that their dialogs default to the last-used project directory and update it on each confirmed pick.
- `topology-definition`: "Record topology image" gains the requirement that its save dialog defaults to the last-used image export directory and updates it on each confirmed pick.

## Impact

- `src/api/options.ts`: two new app-state keys in the electron-store schema (same pattern as `winBounds`).
- `src/api/project.ts`: `handleOpenProject` and `handleCreateProject` pass `defaultPath` and write back the picked directory.
- `src/api/topology.ts`: `handleRecordTopologyImg` passes a directory-anchored `defaultPath` and writes back the picked directory.
- `src/api/project.test.ts`, `src/api/topology.test.ts`: assert `defaultPath` values and store write-back; existing dialog mocks already cover this shape.
- No server, proto, or renderer API surface changes.
