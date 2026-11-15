# Spec Delta

## MODIFIED Requirements

### Requirement: Read node configuration files
In the full edition, the system SHALL fetch the configuration files of a node from the server, indicating whether they come from the running node or from the project archive, and display them to the user with the node's network section rendered as formatted YAML. The student edition SHALL NOT provide a configuration viewer.

#### Scenario: Inspect running node config
- **WHEN** the user opens the configuration viewer of a running node
- **THEN** the files of the running node are listed with their content and the source is marked as running

#### Scenario: Read failure
- **WHEN** the server cannot provide the node's configuration files
- **THEN** the viewer reports the error instead of showing files

#### Scenario: Student edition has no viewer
- **WHEN** a student build renders an open project
- **THEN** no surface allows opening the configuration viewer of a node
