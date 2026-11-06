# Tasks

## 1. App-state persistence

- [x] 1.1 Add `lastProjectDir` and `lastImageExportDir` string keys to the electron-store schema and defaults in `src/api/options.ts` (empty-string default) and export getter/setter helpers alongside `getAppState`/`setAppWinBounds`, verifying with a unit test that setters persist and getters return the stored values

## 2. Project dialogs

- [x] 2.1 Make `handleOpenProject` and `handleCreateProject` in `src/api/project.ts` pass `defaultPath` from the stored project directory (falling back to `os.homedir()` when unset or missing on disk), and verify with `project.test.ts` assertions on the `defaultPath` argument of the mocked dialogs, including the stale-directory fallback
- [x] 2.2 Write back `path.dirname()` of the confirmed pick to `lastProjectDir` in both handlers (not on cancel, not on extension-rejected picks), and verify with `project.test.ts` that a confirmed pick updates the stored directory while a cancel leaves it unchanged

## 3. Topology image dialog

- [x] 3.1 Make `handleRecordTopologyImg` in `src/api/topology.ts` anchor `defaultPath` to the stored image export directory (falling back to `os.homedir()`) with the `topology.png` filename, write back the confirmed pick's directory to `lastImageExportDir`, and verify with `topology.test.ts` that the composed `defaultPath` is passed and the store key updates only on a confirmed pick

## 4. Integration checks

- [x] 4.1 Run `yarn lint` and `yarn test` and confirm both pass
- [x] 4.2 Run `yarn start`, open and create projects and export a topology image across two app launches, and confirm each dialog reopens in its own remembered folder and that exports do not move the project dialogs

## Workflow follow-up

- Archive the change after the project's review requirements are satisfied; archiving syncs the deltas into `project-management` and `topology-definition`.
