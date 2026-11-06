# project-management Specification

## Purpose

Manages gonetem project files (.gnet archives) across their whole lifecycle: opening, creating, saving, closing, and attaching to projects already open on the server.

## Requirements

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

### Requirement: Save project
The system SHALL request a project archive from the server, write the received archive data to the file path recorded when the project was opened or created, and surface the per-node save progress to the user.

#### Scenario: Successful save
- **WHEN** the user saves the current project and the server streams its archive
- **THEN** the file at the recorded path is overwritten with the new archive and progress events are displayed

#### Scenario: Save on attached project
- **WHEN** the current project was attached from the server list and has no recorded file path
- **THEN** the save fails reporting that no filepath is known for the open project

### Requirement: Close project
The system SHALL terminate all internal node consoles, ask the server to close the project while forwarding close progress to the user, and reset the current project.

#### Scenario: Successful close
- **WHEN** the user closes the current project
- **THEN** internal consoles are destroyed, close progress is shown, and the UI returns to the no-project view

### Requirement: Attach to server-side project
The system SHALL list the projects currently open on the server, with their name, id, and opening time, and SHALL allow the user to make one of them the current project without opening a local file.

#### Scenario: Attach project
- **WHEN** the user picks a project from the server-side list
- **THEN** that project becomes current in the UI without any local file dialog

### Requirement: Project state report
The system SHALL report a project's name, id, opening time, overall running flag, and for each node its running flag with the state of every interface.

#### Scenario: Query state
- **WHEN** the project state is requested for a project known to the server
- **THEN** the report contains the project identity and per-node running and interface states
