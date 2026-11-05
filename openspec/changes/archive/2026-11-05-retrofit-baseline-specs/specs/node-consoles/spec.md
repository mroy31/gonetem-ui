# Spec Delta

## Purpose

Gives the user shells inside emulated nodes, either in external terminal windows or in embedded terminal tabs, with output surviving tab switches.

## ADDED Requirements

### Requirement: External node terminal
The system SHALL open an external terminal window for a node by executing the configured terminal command template with the node name and a `gonetem-console console` command targeting `prjId.nodeId`, optionally requesting an interactive shell.

#### Scenario: Open external console
- **WHEN** the user opens a node's external console and the configured terminal executable is found
- **THEN** a terminal process starts running the console command for that node

#### Scenario: Terminal executable missing
- **WHEN** the terminal command from the options does not resolve to an executable
- **THEN** the request fails reporting that the configured terminal command was not found

### Requirement: Open all external consoles
The system SHALL open an external terminal for every running node of the current project in one action.

#### Scenario: Bulk open
- **WHEN** the user triggers "open all consoles" and all spawned terminals succeed
- **THEN** each running node gets a terminal and the action reports success

### Requirement: Internal console session
The system SHALL open an embedded terminal for a node by asking the server for its console command and attaching a bidirectional exec stream: keystrokes from the terminal are forwarded to the node, and node stdout, stderr, error, and close events are routed back to that node's terminal only.

#### Scenario: Interactive session
- **WHEN** the user types in an embedded console tab
- **THEN** the input reaches the node and the node's output appears in the same tab

#### Scenario: Console close from server
- **WHEN** the server reports the console session closed
- **THEN** the tab is closed and the session is removed from the open list

### Requirement: Console terminal size sync
The system SHALL forward embedded terminal resize events, including columns and rows, to the node's exec session.

#### Scenario: Resize tab
- **WHEN** the embedded terminal changes its grid size
- **THEN** the node session is notified of the new width and height

### Requirement: Console output retention across tabs
The system SHALL keep a serialized snapshot of each open console's visible output, refresh it as output arrives, and replay it when the user returns to that console tab; snapshots are dropped when the session ends or the project closes.

#### Scenario: Switch tabs and return
- **WHEN** the user switches to another console tab and back to a still-open one
- **THEN** the previous visible output is restored in the terminal

#### Scenario: Project closed
- **WHEN** the current project is closed
- **THEN** all embedded console sessions are destroyed and their snapshots dropped

### Requirement: List open consoles
The system SHALL report the node names that currently have an embedded console session so the UI can restore console tabs.

#### Scenario: Restore tabs
- **WHEN** the console panel opens with sessions already running
- **THEN** tabs are shown for exactly the nodes with a live session
