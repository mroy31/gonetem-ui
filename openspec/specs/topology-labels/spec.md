# topology-labels Specification

## Purpose

Lets users annotate the topology graph with free-floating text labels whose content and position are stored in the network file and rendered on the canvas and in exported images.

## Requirements

### Requirement: Add a text label
In the full edition, the system SHALL let the user create a text label by right-clicking an empty area of the topology graph canvas and choosing the add-label entry, then confirming non-empty text in a text input dialog. The label SHALL appear on the canvas at the position of the right-click. The student edition SHALL NOT offer any label creation entry.

#### Scenario: Create label at click position
- **WHEN** the user right-clicks empty canvas, chooses the add-label entry, and confirms non-empty text
- **THEN** a label with that text appears at the right-clicked position

#### Scenario: Cancel creation
- **WHEN** the user cancels the text input dialog
- **THEN** no label is added to the canvas

#### Scenario: Empty text rejected
- **WHEN** the user confirms the text input dialog with empty or whitespace-only text
- **THEN** no label is added to the canvas

#### Scenario: Student canvas has no add entry
- **WHEN** a student right-clicks an empty area of the topology graph
- **THEN** no add-label entry is offered

### Requirement: Edit a label by double-click
In the full edition, the system SHALL let the user edit a label's text by double-clicking it, which opens the text input dialog prefilled with the current text. Confirming non-empty text SHALL update the label in place, keeping its position. Confirming empty text SHALL delete the label. The student edition SHALL NOT open a label edit dialog.

#### Scenario: Update text in place
- **WHEN** the user double-clicks a label, replaces the text with non-empty text, and confirms
- **THEN** the label shows the new text at its previous position

#### Scenario: Clearing text deletes the label
- **WHEN** the user empties the text in the dialog and confirms
- **THEN** the label is removed from the canvas

#### Scenario: Student double-click does nothing
- **WHEN** a student double-clicks a label on the canvas
- **THEN** no dialog opens and the label text is unchanged

### Requirement: Delete a label from the context menu
In the full edition, the system SHALL offer a delete entry in the context menu shown when the user right-clicks a label, and choosing it SHALL remove the label from the canvas. The student edition SHALL NOT offer a label delete entry.

#### Scenario: Delete via context menu
- **WHEN** the user right-clicks a label and chooses the delete entry
- **THEN** the label is removed from the canvas

#### Scenario: Student label context menu has no delete
- **WHEN** a student right-clicks a label
- **THEN** no delete entry is offered

### Requirement: Move a label by dragging
The system SHALL let the user drag a label to any position on the canvas, independently of nodes and links.

#### Scenario: Drag repositions the label
- **WHEN** the user drags a label to a new spot and releases
- **THEN** the label stays at the new position on the canvas

### Requirement: Persist labels in the network file
In the full edition, on the existing topology save action, the system SHALL write every visible label into a top-level `ui` section of the network file as a map keyed by generated ids prefixed with `lbl-`, each entry holding the label text and its position. Saving SHALL preserve the rest of the file's content and structure. A label's id SHALL stay the same across text edits and moves. The student edition provides no topology save action and SHALL NOT write labels to the network file.

#### Scenario: Save writes labels under the ui section
- **WHEN** the user saves the topology while the canvas shows two labels
- **THEN** the saved file contains both labels with their text and current position under the top-level `ui` section keyed by `lbl-`-prefixed ids

#### Scenario: Ids survive text edits
- **WHEN** the user edits a label's text and saves, then edits the text again and saves
- **THEN** the entry keeps the same `lbl-` key in the file

#### Scenario: Removing a label removes its entry
- **WHEN** the user deletes a label and saves
- **THEN** the saved file contains no entry for that label

#### Scenario: Existing file content preserved
- **WHEN** the user saves a topology that already defines nodes, links, and node-level ui data
- **THEN** those parts are still present and unchanged apart from the positions the save action already updates

### Requirement: Render labels from the network file
When the topology graph is rendered, the system SHALL display one label per entry of the network file's top-level `ui` section labels map, with the stored text at the stored position. A label entry whose key collides with a node name SHALL be ignored during rendering.

#### Scenario: Saved labels reappear on open
- **WHEN** a project whose file defines labels is opened
- **THEN** each label is rendered with its stored text at its stored position

#### Scenario: Colliding label key ignored
- **WHEN** the labels map contains an entry keyed with the name of an existing node
- **THEN** that entry is not rendered as a label and the node renders normally

#### Scenario: File without ui section renders unchanged
- **WHEN** a project whose file has no top-level `ui` section is opened
- **THEN** the graph renders exactly as before this capability existed

### Requirement: Label changes are ephemeral until saved
Changes to labels (add, edit, move, delete) SHALL NOT modify the network file until the user triggers the topology save action, and SHALL be lost if the graph is re-rendered from the file without a prior save.

#### Scenario: Unsaved additions vanish
- **WHEN** the user adds and moves labels, then reopens the project without saving
- **THEN** only the labels stored in the file are shown

#### Scenario: Save captures current labels
- **WHEN** the user adds labels and then triggers the save action
- **THEN** the file is updated to contain the current set of labels

### Requirement: Layouts never rearrange labels
Automatic and user-selected graph layouts SHALL NOT move labels, and the presence of stored labels SHALL NOT count as stored node positions for deciding whether to run the automatic initial layout. Fitting the view SHALL include labels so they are reachable.

#### Scenario: Layout leaves labels in place
- **WHEN** the user applies any layout from the toolbar while labels are visible
- **THEN** the nodes are rearranged and every label keeps its position

#### Scenario: Initial layout still runs with only labels stored
- **WHEN** a topology is opened whose file stores labels but no node positions
- **THEN** the automatic initial layout arranges the nodes and the labels are not moved by it

#### Scenario: Fit includes labels
- **WHEN** the view is fitted to the graph
- **THEN** labels are inside the fitted area

### Requirement: Exported image includes labels
A topology image export SHALL include every label currently visible on the canvas, drawn at its on-canvas position.

#### Scenario: Labels appear in exported PNG
- **WHEN** the user exports the topology image while labels are visible
- **THEN** the exported image contains the labels at their positions
