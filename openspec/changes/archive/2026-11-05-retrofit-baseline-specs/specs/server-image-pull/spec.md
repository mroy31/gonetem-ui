# Spec Delta

## Purpose

Lets the user make the server fetch the docker images the emulator needs, with per-image feedback while it runs.

## ADDED Requirements

### Requirement: Pull server docker images
The system SHALL trigger the server's image pull and keep a progress panel open for the duration of the pull stream, forwarding each per-image start, success, and error event to that panel.

#### Scenario: Pull with progress
- **WHEN** the user requests an image pull and the server streams per-image events
- **THEN** the panel shows each image's state as the events arrive and closes when the stream completes

#### Scenario: Pull unavailable
- **WHEN** the pull cannot be started (for example no server connection)
- **THEN** the operation reports the failure reason
