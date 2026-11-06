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
The system SHALL offer a save dialog defaulting to the filename `topology.png` inside the last-used image export directory, with a PNG filter, and write the rendered topology image to the chosen path. The system SHALL update the last-used image export directory to the folder of every confirmed path, independently of the project file directory memory.

#### Scenario: Export image
- **WHEN** the user confirms a path in the record dialog
- **THEN** the image bytes are written to that file

#### Scenario: Cancel export
- **WHEN** the user cancels the record dialog
- **THEN** nothing is written, no error is raised, and the stored image export directory is unchanged

#### Scenario: Dialog opens in last image export directory
- **WHEN** the record dialog is shown and a last-used image export directory is stored and still exists
- **THEN** the dialog opens in that directory with the default filename `topology.png`

#### Scenario: Image directory memory is independent
- **WHEN** the user exports an image to some directory and then opens or creates a project
- **THEN** the project dialogs still open in the last-used project directory, unaffected by the image export

### Requirement: Automatic initial graph layout
When the topology graph is first rendered and no node has a saved position, the system SHALL automatically arrange all nodes with a default layout and fit the result to the visible area. When at least one node has a saved position, the system SHALL render every node at its saved position without running the automatic layout.

#### Scenario: Fresh topology opens arranged
- **WHEN** a topology with no saved node positions is opened
- **THEN** the nodes are arranged automatically by the default layout instead of overlapping at a single point, and the view fits them

#### Scenario: Saved positions win over automatic layout
- **WHEN** a topology with saved node positions is opened
- **THEN** the nodes render at their saved positions and no automatic layout runs

#### Scenario: Partially positioned topology keeps saved placement
- **WHEN** a topology is opened where some but not all nodes have saved positions
- **THEN** the nodes with saved positions render at those positions and no automatic layout runs

### Requirement: User-selected graph layout
The topology graph toolbar SHALL offer a layout menu that applies the chosen arrangement (Force, Grid, Concentric, or Hierarchical) to all nodes and fits the result to the visible area. The menu SHALL be available regardless of whether nodes have saved positions.

#### Scenario: Apply a layout from the menu
- **WHEN** the user selects a layout from the menu
- **THEN** every node is rearranged according to that layout and the view fits the result

#### Scenario: Reapplying the same layout
- **WHEN** the user selects the same layout entry again
- **THEN** the layout runs again over the current graph

### Requirement: Layout results persist only on save
Applying a layout, whether automatic or user-selected, SHALL NOT modify the topology definition. The rearranged positions SHALL become part of the topology definition only when the user saves the topology through the existing save action.

#### Scenario: Applied layout without save is ephemeral
- **WHEN** the user applies a layout and then reopens the project without saving
- **THEN** the graph shows the previously saved positions, or the automatic layout again when no positions were ever saved

#### Scenario: Applied layout followed by save
- **WHEN** the user applies a layout and then saves the topology
- **THEN** the rearranged node positions are written into the topology definition
