# Spec Delta

## MODIFIED Requirements

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
