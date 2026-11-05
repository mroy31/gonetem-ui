# topology-lifecycle Specification

## Purpose

Runs and reloads a project's topology on the server while giving the user live per-phase progress and the startup messages each node produced.

## Requirements

### Requirement: Run topology with streamed progress
The system SHALL start the current topology on the server and forward every progress event of the run stream to the UI until the stream completes.

#### Scenario: Successful run
- **WHEN** the user launches the topology and the server run stream completes
- **THEN** the progress overlay closes and the operation is reported successful

#### Scenario: Run stream error
- **WHEN** the server run stream fails
- **THEN** the operation is reported failed with an error message naming the project

### Requirement: Reload topology with streamed progress
The system SHALL apply the project's current topology definition to the running topology, forwarding progress events of the reload stream to the UI.

#### Scenario: Successful reload
- **WHEN** the user requests a topology reload and the server reload stream completes
- **THEN** the reload indicator closes and the operation is reported successful

### Requirement: Progress phases feedback
While a run or reload stream is active, the UI SHALL display progress bars driven by the stream, showing started nodes, bridges, link setups, and loaded configurations as counts out of their announced totals.

#### Scenario: Partial progress visible
- **WHEN** the server announces a node total of N and has started k of N nodes
- **THEN** the overlay shows the node-starting bar at k of N while k is less than N

### Requirement: Node startup messages feedback
The UI SHALL display, as dismissible toasts, the startup messages reported per node by the run or reload stream.

#### Scenario: Node reports messages
- **WHEN** a stream event carries messages for a node
- **THEN** those messages are shown to the user until dismissed
