# Spec Delta

## ADDED Requirements

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
