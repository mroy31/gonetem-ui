# topology-definition Specification

## Purpose

Lets the user view and change a project's network topology definition, validate it, and export a picture of the drawn topology.

## Requirements

### Requirement: Read topology definition
The system SHALL fetch the project's topology file content from the server as text for display and editing.

#### Scenario: Successful read
- **WHEN** the topology of an open project is requested
- **THEN** the current server-side content is returned as editable text

### Requirement: Write topology definition
The system SHALL send user-provided topology content to the server as the project's new topology definition.

#### Scenario: Save from editor
- **WHEN** the user saves the topology from the YAML editor
- **THEN** the edited content is sent to the server and a failure is reported as an error message

#### Scenario: Persist graph layout
- **WHEN** the user moves a node in the topology graph
- **THEN** the updated positions are written back as the project's topology definition

### Requirement: Topology content validation
The YAML editor SHALL diagnose invalid YAML in the buffer, and the system SHALL additionally ask the server to check a topology definition and surface the server's error message when the check fails.

#### Scenario: Invalid YAML in editor
- **WHEN** the edited buffer is not parseable YAML
- **THEN** the editor marks a lint error instead of silently accepting it

#### Scenario: Server rejects topology
- **WHEN** a topology check is requested and the server reports an error
- **THEN** the server's error message is shown to the user

### Requirement: Record topology image
The system SHALL offer a save dialog defaulting to `topology.png` with a PNG filter and write the rendered topology image to the chosen path.

#### Scenario: Export image
- **WHEN** the user confirms a path in the record dialog
- **THEN** the image bytes are written to that file

#### Scenario: Cancel export
- **WHEN** the user cancels the record dialog
- **THEN** nothing is written and no error is raised
