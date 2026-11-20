# Spec Delta

## MODIFIED Requirements

### Requirement: Add a text label
In the full edition, the system SHALL let the user create a label by right-clicking an empty area of the topology graph canvas and choosing the add-label entry, then confirming non-empty text in a text input dialog that also offers a kind choice between subnet and AS number, defaulting to subnet. The label SHALL appear on the canvas at the position of the right-click with the chosen kind. The student edition SHALL NOT offer any label creation entry.

#### Scenario: Create label at click position
- **WHEN** the user right-clicks empty canvas, chooses the add-label entry, and confirms non-empty text
- **THEN** a label with that text appears at the right-clicked position

#### Scenario: Default kind is subnet
- **WHEN** the user confirms the label dialog without changing the kind choice
- **THEN** the created label has the subnet kind

#### Scenario: Create an AS number label
- **WHEN** the user chooses the AS number kind and confirms non-empty text
- **THEN** the created label has the AS number kind

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
In the full edition, the system SHALL let the user edit a label by double-clicking it, which opens the text input dialog prefilled with the current text and the current kind. Confirming non-empty text SHALL update the label's text and kind in place, keeping its position. Confirming empty text SHALL delete the label. The student edition SHALL NOT open a label edit dialog.

#### Scenario: Update text in place
- **WHEN** the user double-clicks a label, replaces the text with non-empty text, and confirms
- **THEN** the label shows the new text at its previous position

#### Scenario: Change kind in place
- **WHEN** the user double-clicks a subnet label, switches the kind to AS number, and confirms
- **THEN** the label keeps its text and position and renders with the AS number style

#### Scenario: Clearing text deletes the label
- **WHEN** the user empties the text in the dialog and confirms
- **THEN** the label is removed from the canvas

#### Scenario: Student double-click does nothing
- **WHEN** a student double-clicks a label on the canvas
- **THEN** no dialog opens and the label text is unchanged

### Requirement: Persist labels in the network file
In the full edition, on the existing topology save action, the system SHALL write every visible label into a top-level `ui` section of the network file as a map keyed by generated ids prefixed with `lbl-`, each entry holding the label text, the label kind, and its position. The kind SHALL be written explicitly on every entry, including the subnet kind. Saving SHALL preserve the rest of the file's content and structure. A label's id SHALL stay the same across text edits, kind changes, and moves. The student edition provides no topology save action and SHALL NOT write labels to the network file.

#### Scenario: Save writes labels under the ui section
- **WHEN** the user saves the topology while the canvas shows two labels
- **THEN** the saved file contains both labels with their text and current position under the top-level `ui` section keyed by `lbl-`-prefixed ids

#### Scenario: Save writes kind explicitly
- **WHEN** the user saves a topology with one AS number label and one subnet label
- **THEN** the stored entries carry their respective kinds explicitly in the file

#### Scenario: Ids survive text edits
- **WHEN** the user edits a label's text and saves, then edits the text again and saves
- **THEN** the entry keeps the same `lbl-` key in the file

#### Scenario: Ids survive kind changes
- **WHEN** the user changes a label's kind and saves
- **THEN** the entry keeps the same `lbl-` key with the new kind

#### Scenario: Removing a label removes its entry
- **WHEN** the user deletes a label and saves
- **THEN** the saved file contains no entry for that label

#### Scenario: Existing file content preserved
- **WHEN** the user saves a topology that already defines nodes, links, and node-level ui data
- **THEN** those parts are still present and unchanged apart from the positions the save action already updates

### Requirement: Render labels from the network file
When the topology graph is rendered, the system SHALL display one label per entry of the network file's top-level `ui` section labels map, with the stored text at the stored position and styled according to the stored kind. An entry whose kind is missing or is not a known kind SHALL be rendered as a subnet label. A label entry whose key collides with a node name SHALL be ignored during rendering.

#### Scenario: Saved labels reappear on open
- **WHEN** a project whose file defines labels is opened
- **THEN** each label is rendered with its stored text at its stored position

#### Scenario: Kind survives round trip
- **WHEN** a project whose file stores an AS number label kind is opened
- **THEN** that label renders with the AS number style

#### Scenario: Legacy entry without kind renders as subnet
- **WHEN** a project whose label entries carry no kind field is opened
- **THEN** those labels render with the subnet style exactly as they did before kinds existed

#### Scenario: Unknown kind falls back to subnet
- **WHEN** a label entry stores a kind value that is not a known kind
- **THEN** that label renders with the subnet style

#### Scenario: Colliding label key ignored
- **WHEN** the labels map contains an entry keyed with the name of an existing node
- **THEN** that entry is not rendered as a label and the node renders normally

#### Scenario: File without ui section renders unchanged
- **WHEN** a project whose file has no top-level `ui` section is opened
- **THEN** the graph renders exactly as before this capability existed

## ADDED Requirements

### Requirement: Label kinds differ only in canvas style
The system SHALL render subnet labels with the sticky-note box style used by labels before kinds existed, and SHALL render AS number labels as borderless, background-free bold text in a distinct color at a larger font size than subnet labels. A label's kind SHALL affect only its rendering and SHALL NOT constrain the text the user may enter.

#### Scenario: AS number label style
- **WHEN** a label with the AS number kind is displayed
- **THEN** it renders as bold text with no border and no background, in the AS color and size

#### Scenario: Any text accepted for any kind
- **WHEN** the user creates an AS number label whose text is not a number
- **THEN** the label is created and rendered with the AS number style

#### Scenario: Subnet label style unchanged
- **WHEN** a label with the subnet kind is displayed
- **THEN** it renders identically to how labels rendered before kinds existed
