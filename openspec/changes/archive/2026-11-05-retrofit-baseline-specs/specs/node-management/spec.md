# Spec Delta

## Purpose

Controls the lifecycle of individual emulated nodes and their interfaces, and lets the user inspect the configuration files a node uses.

## ADDED Requirements

### Requirement: Node lifecycle actions
The system SHALL let the user start, stop, and restart a single node of the current project, reporting server-side failures.

#### Scenario: Start node
- **WHEN** the user starts a stopped node and the server acknowledges
- **THEN** the node is reported running after the next state refresh

#### Scenario: Server refuses action
- **WHEN** a node action fails on the server
- **THEN** the error naming the node is shown to the user

### Requirement: Interface state control
The system SHALL let the user administratively set a numbered interface of a node up or down, reporting server-side failures.

#### Scenario: Admin down an interface
- **WHEN** the user sets an interface down from the node context menu and the server acknowledges
- **THEN** the interface state is reported down after the next state refresh

### Requirement: Read node configuration files
The system SHALL fetch the configuration files of a node from the server, indicating whether they come from the running node or from the project archive, and display them to the user with the node's network section rendered as formatted YAML.

#### Scenario: Inspect running node config
- **WHEN** the user opens the configuration viewer of a running node
- **THEN** the files of the running node are listed with their content and the source is marked as running

#### Scenario: Read failure
- **WHEN** the server cannot provide the node's configuration files
- **THEN** the viewer reports the error instead of showing files
