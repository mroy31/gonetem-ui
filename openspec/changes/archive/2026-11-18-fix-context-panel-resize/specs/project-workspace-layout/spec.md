# Spec Delta

## Purpose

Defines how the project view arranges the topology graph area and the project context panel side by side, including user-driven panel resizing and how the graph viewport adapts to its container.

## ADDED Requirements

### Requirement: Side-by-side project view layout
While a project is open, the system SHALL display the topology graph area and the project context panel side by side, together filling the available window width without horizontal overflow of the application content.

#### Scenario: Both areas visible at default sizes
- **WHEN** a project is opened
- **THEN** the graph area and the context panel are both visible side by side and the application content fits the window width with no horizontal scrolling

### Requirement: Context panel resize keeps total width fixed
The system SHALL let the user change the context panel width by dragging its resize handle, and the graph area width SHALL absorb the inverse of every width change so the combined width stays equal to the window width.

#### Scenario: Widening the panel shrinks the graph area
- **WHEN** the user drags the resize handle to the left, increasing the panel width
- **THEN** the graph area width decreases by the same amount and the application content still fits the window width

#### Scenario: Narrowing the panel grows the graph area
- **WHEN** the user drags the resize handle to the right, decreasing the panel width
- **THEN** the graph area width increases by the same amount and the application content still fits the window width

#### Scenario: Resizing stops on release
- **WHEN** the user releases the mouse button after a drag
- **THEN** the panel keeps the width reached at release and stops following further mouse movement

### Requirement: Context panel width bounds
The system SHALL clamp the context panel width so that it never drops below a minimum usable width and never grows beyond the window width minus a minimum visible width for the graph area.

#### Scenario: Dragging past the minimum
- **WHEN** the user drags the handle so the panel width would fall below the minimum
- **THEN** the panel stays at the minimum width

#### Scenario: Dragging past the maximum
- **WHEN** the user drags the handle so the panel width would exceed the window width minus the graph area minimum
- **THEN** the panel stays at that maximum width

### Requirement: Graph viewport follows its container
The topology graph rendering SHALL adapt to changes of the graph area's box, including those caused by context panel resizing and window resizing, without requiring a reload of the project.

#### Scenario: Graph area shrinks during a panel resize
- **WHEN** the graph area's width decreases because the user widened the context panel
- **THEN** the graph canvas occupies the new box and no part of the previously sized canvas overflows or leaves blank space

#### Scenario: Window resized
- **WHEN** the application window is resized while a project is open
- **THEN** the graph canvas occupies the graph area's new box
