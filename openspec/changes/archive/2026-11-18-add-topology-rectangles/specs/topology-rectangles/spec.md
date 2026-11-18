# Spec Delta

## Purpose

Lets users annotate the topology graph with decorative empty rectangles (dotted border, no text) that delimit regions of the canvas, whose geometry is stored in the network file and rendered on the canvas and in exported images.

## ADDED Requirements

### Requirement: Add a rectangle
In the full edition, the system SHALL let the user create a rectangle by right-clicking an empty area of the topology graph canvas and choosing the add-rectangle entry. The rectangle SHALL appear at the right-clicked position with a default size, an empty (transparent) fill, and a dotted border. The student edition SHALL NOT offer any rectangle creation entry.

#### Scenario: Create rectangle at click position
- **WHEN** the user right-clicks empty canvas and chooses the add-rectangle entry
- **THEN** a dotted-border, empty-filled rectangle appears at the right-clicked position with the default size

#### Scenario: No modal on creation
- **WHEN** the user chooses the add-rectangle entry
- **THEN** the rectangle appears immediately without any text input dialog

#### Scenario: Student canvas has no add entry
- **WHEN** a student right-clicks an empty area of the topology graph
- **THEN** no add-rectangle entry is offered

### Requirement: Move a rectangle by dragging
The system SHALL let the user move a rectangle by dragging any point of its area, independently of nodes and links. Nodes and links overlapping the rectangle SHALL keep their normal interaction, including dragging, when pointered on them.

#### Scenario: Drag repositions the rectangle
- **WHEN** the user drags a rectangle to a new spot and releases
- **THEN** the rectangle keeps its size and stays at the new position

#### Scenario: Node over a rectangle stays draggable
- **WHEN** the user drags a node that sits on top of a rectangle
- **THEN** only the node moves and the rectangle stays in place

### Requirement: Resize a rectangle with corner handles
The system SHALL show a resize handle at each corner of a selected rectangle and hide the handles when the rectangle is deselected. Dragging a handle SHALL resize the rectangle with the opposite corner kept fixed, and the rectangle SHALL never shrink below a minimum size. The handles are editing affordances and SHALL NOT be rendered in exported images.

#### Scenario: Handles appear on selection
- **WHEN** the user selects a rectangle
- **THEN** a resize handle is shown at each of its four corners

#### Scenario: Corner drag resizes with opposite corner pinned
- **WHEN** the user drags one corner handle and releases
- **THEN** the rectangle's width and height reflect the dragged corner while the opposite corner stays at its previous position

#### Scenario: Minimum size enforced
- **WHEN** the user drags a handle past the minimum-size limit
- **THEN** the rectangle stops shrinking at the minimum size

#### Scenario: Handles hidden on deselect and in export
- **WHEN** the user deselects the rectangle and then exports the topology image
- **THEN** no handle is visible on the canvas or in the exported image

### Requirement: Delete a rectangle from the context menu
In the full edition, the system SHALL offer a delete entry in the context menu shown when the user right-clicks a rectangle, and choosing it SHALL remove the rectangle from the canvas. Rectangles carry no text, so double-clicking a rectangle SHALL have no effect. The student edition SHALL NOT offer a rectangle delete entry.

#### Scenario: Delete via context menu
- **WHEN** the user right-clicks a rectangle and chooses the delete entry
- **THEN** the rectangle is removed from the canvas

#### Scenario: Double-click does nothing
- **WHEN** the user double-clicks a rectangle
- **THEN** no dialog opens and the rectangle is unchanged

#### Scenario: Student rectangle context menu has no delete
- **WHEN** a student right-clicks a rectangle
- **THEN** no delete entry is offered

### Requirement: Persist rectangles in the network file
In the full edition, on the existing topology save action, the system SHALL write every visible rectangle into a map in the network file's top-level `ui` section, keyed by generated ids prefixed with `rect-`, each entry holding its center position, width, and height. Saving SHALL preserve the rest of the file's content and structure. The student edition provides no topology save action and SHALL NOT write rectangles.

#### Scenario: Save writes rectangles under the ui section
- **WHEN** the user saves the topology while the canvas shows two rectangles
- **THEN** the saved file contains both rectangles with their center position, width, and height under the top-level `ui` section keyed by `rect-`-prefixed ids

#### Scenario: Ids survive moves and resizes
- **WHEN** the user moves and resizes a rectangle and saves, then moves it again and saves
- **THEN** the entry keeps the same `rect-` key in the file

#### Scenario: Removing a rectangle removes its entry
- **WHEN** the user deletes a rectangle and saves
- **THEN** the saved file contains no entry for that rectangle

#### Scenario: Existing file content preserved
- **WHEN** the user saves a topology that already defines nodes, links, and node-level or `ui`-level data such as labels
- **THEN** those parts are still present and unchanged apart from the positions the save action already updates

### Requirement: Render rectangles from the network file
When the topology graph is rendered, the system SHALL display one rectangle per entry of the network file's `ui` section rectangle map, drawn with its stored geometry behind nodes and links. A rectangle entry whose key collides with a node name SHALL be ignored during rendering.

#### Scenario: Saved rectangles reappear on open
- **WHEN** a project whose file defines rectangles is opened
- **THEN** each rectangle is rendered at its stored position and size

#### Scenario: Colliding rectangle key ignored
- **WHEN** the rectangle map contains an entry keyed with the name of an existing node
- **THEN** that entry is not rendered as a rectangle and the node renders normally

#### Scenario: File without rectangles renders unchanged
- **WHEN** a project whose file has no rectangle map in its `ui` section is opened
- **THEN** the graph renders exactly as before this capability existed

### Requirement: Rectangle changes are ephemeral until saved
Changes to rectangles (add, move, resize, delete) SHALL NOT modify the network file until the user triggers the topology save action, and SHALL be lost if the graph is re-rendered from the file without a prior save.

#### Scenario: Unsaved additions vanish
- **WHEN** the user adds and resizes rectangles, then reopens the project without saving
- **THEN** only the rectangles stored in the file are shown

#### Scenario: Save captures current rectangles
- **WHEN** the user adds rectangles and then triggers the save action
- **THEN** the file is updated to contain the current set of rectangles

### Requirement: Layouts never rearrange rectangles
Automatic and user-selected graph layouts SHALL NOT move or resize rectangles, and the presence of stored rectangles SHALL NOT count as stored node positions for deciding whether to run the automatic initial layout. Fitting the view SHALL include rectangles so they are reachable.

#### Scenario: Layout leaves rectangles in place
- **WHEN** the user applies any layout from the toolbar while rectangles are visible
- **THEN** the nodes are rearranged and every rectangle keeps its position and size

#### Scenario: Initial layout still runs with only rectangles stored
- **WHEN** a topology is opened whose file stores rectangles but no node positions
- **THEN** the automatic initial layout arranges the nodes and the rectangles are not moved by it

#### Scenario: Fit includes rectangles
- **WHEN** the view is fitted to the graph
- **THEN** rectangles are inside the fitted area

### Requirement: Exported image includes rectangles
A topology image export SHALL include every rectangle currently visible on the canvas, drawn at its on-canvas position and size.

#### Scenario: Rectangles appear in exported PNG
- **WHEN** the user exports the topology image while rectangles are visible
- **THEN** the exported image contains the rectangles at their positions and sizes
