# Spec Delta

## MODIFIED Requirements

### Requirement: Open project file
The system SHALL let the user pick a `.gnet` file through the OS open dialog, send its content to the server, and track the resulting project as the current project together with the file path. The open dialog SHALL open in the last-used project directory, and the system SHALL update that directory to the folder of every confirmed pick.

#### Scenario: Successful open
- **WHEN** the user selects a valid `.gnet` file and the server accepts it
- **THEN** the returned project id becomes the current project and the UI switches to the project view

#### Scenario: Wrong extension
- **WHEN** the selected file does not have the `.gnet` extension
- **THEN** the open fails with an error naming the expected extension and no request is sent

#### Scenario: Project already open
- **WHEN** open is requested while a project is already current
- **THEN** the request fails reporting the identifier of the already-open project

#### Scenario: Dialog opens in last project directory
- **WHEN** the open dialog is shown and a last-used project directory is stored and still exists
- **THEN** the dialog opens in that directory

#### Scenario: Picked directory is remembered
- **WHEN** the user confirms a file pick in the open dialog
- **THEN** the containing directory of the picked file is stored as the last-used project directory

#### Scenario: Cancel does not overwrite memory
- **WHEN** the user cancels the open dialog
- **THEN** the stored last-used project directory is unchanged

#### Scenario: Stored directory no longer available
- **WHEN** the open dialog is shown and the stored directory does not exist
- **THEN** the dialog opens in the user's home directory

### Requirement: Create empty project
The system SHALL create a new `.gnet` archive at a user-chosen path containing an initial topology file with empty `nodes`, `links`, and `bridges` sections, then open it on the server as the current project. The create dialog SHALL open in the same last-used project directory and SHALL update it to the folder of every confirmed choice.

#### Scenario: Successful creation
- **WHEN** the user chooses a new `.gnet` path in the save dialog
- **THEN** the archive file exists on disk and the new project becomes current

#### Scenario: Wrong extension
- **WHEN** the chosen path does not end with `.gnet`
- **THEN** creation fails with an error naming the expected extension

#### Scenario: Create dialog shares the project directory memory
- **WHEN** the create dialog is shown after a project file was picked from some directory
- **THEN** the create dialog opens in that same directory, and confirming a new file there updates the shared memory to that folder
