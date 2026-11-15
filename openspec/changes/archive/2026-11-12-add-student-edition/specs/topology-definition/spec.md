# Spec Delta

## MODIFIED Requirements

### Requirement: Write topology definition
In the full edition, the system SHALL send user-provided topology content to the server as the project's new topology definition. The student edition SHALL provide no action that writes the topology definition.

#### Scenario: Save from editor
- **WHEN** the user saves the topology from the YAML editor
- **THEN** the edited content is sent to the server and a failure is reported as an error message

#### Scenario: Persist graph layout
- **WHEN** the user moves a node in the topology graph
- **THEN** the updated positions are written back as the project's topology definition

#### Scenario: Student edition has no write action
- **WHEN** a student build renders an open project
- **THEN** neither the graph toolbar nor any other surface offers a topology save action

### Requirement: Topology content validation
In the full edition, the YAML editor SHALL diagnose invalid YAML in the buffer, and the system SHALL additionally ask the server to check a topology definition and surface the server's error message when the check fails. The student edition has no topology editor and performs no topology check.

#### Scenario: Invalid YAML in editor
- **WHEN** the edited buffer is not parseable YAML
- **THEN** the editor marks a lint error instead of silently accepting it

#### Scenario: Server rejects topology
- **WHEN** a topology check is requested and the server reports an error
- **THEN** the server's error message is shown to the user
