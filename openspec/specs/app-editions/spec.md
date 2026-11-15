# app-editions Specification

## Purpose

Defines build-time application editions (full and student), the configuration baked into each edition, the features the student edition must not offer, and how the editions stay separate when installed on one machine.

## Requirements

### Requirement: Build-time edition selection
The system SHALL determine its edition (full or student) from a value fixed at build time, defaulting to the full edition when none is specified. Any other edition value SHALL fail the build instead of producing an application.

#### Scenario: Default build is full edition
- **WHEN** the application is built without specifying an edition
- **THEN** the resulting application provides the full feature set unchanged

#### Scenario: Student build
- **WHEN** the application is built with the student edition selected
- **THEN** the resulting application behaves as the student edition at every launch

#### Scenario: Invalid edition value
- **WHEN** the application is built with an edition value other than full or student
- **THEN** the build fails with an error naming the invalid value

### Requirement: Baked student server configuration
The student edition SHALL use a server URI and autoconnect setting fixed at build time as its configured server connection, and SHALL NOT provide any user interface to view or change them. The autoconnect behavior on launch SHALL apply to these baked values as it does to stored options in the full edition. TLS settings are not configurable in the student edition and SHALL remain disabled.

#### Scenario: Student build with server URI
- **WHEN** a student build packaged with a server URI launches
- **THEN** the app attempts a connection to that URI at startup without user action and without showing an options dialog

#### Scenario: Student options query returns baked values
- **WHEN** the renderer requests the current options in a student build
- **THEN** the result contains the baked server URI, autoconnect enabled, TLS disabled, and the built-in console command template, without reading persisted user options

#### Scenario: Student build without server URI is rejected at pack time
- **WHEN** a student build is packaged without a non-empty server URI
- **THEN** packaging fails with an error and no application is produced

### Requirement: Student edition feature set
The student edition SHALL NOT offer the topology definition editor, the topology save action, label editing, the node configuration file viewer, or the options dialog. All other full-edition capabilities SHALL behave as in the full edition.

#### Scenario: Student project workspace
- **WHEN** a student opens a project containing a topology with saved positions and labels
- **THEN** the graph renders the nodes and labels, layouts/fit/image export work, and no tab or button exposes topology editing, label editing, configuration viewing, or options

#### Scenario: Kept student capabilities
- **WHEN** a student opens or creates a project, saves or reloads it, runs the topology, opens a node console, or pulls server images
- **THEN** each of these operations behaves exactly as in the full edition

#### Scenario: Ephemeral rearrangement
- **WHEN** a student drags a node or applies a layout and then reopens the project
- **THEN** the graph shows the previously saved positions, unchanged by the student's local rearrangement

#### Scenario: Full edition unchanged
- **WHEN** the full edition is launched
- **THEN** the topology editor, topology save, label editing, configuration viewer, and options dialog are all available exactly as before

### Requirement: Student edition IPC surface
In a student build the main process SHALL NOT register handlers for topology definition writing, topology definition validation, node configuration file reading, or user option writing, and the renderer-facing API SHALL NOT expose methods for those operations. Renderer code paths for these operations SHALL be unreachable in a student build.

#### Scenario: Gated operations absent from the API
- **WHEN** the renderer-facing API object is inspected in a student build
- **THEN** it contains no method for writing a topology, checking a topology, reading node configuration files, or setting options

#### Scenario: Gated IPC channels unhandled
- **WHEN** an invoke is attempted on a gated channel in a student build by any means available to the renderer
- **THEN** no handler executes and the invoke fails as having no registered handler

#### Scenario: Non-gated operations unaffected
- **WHEN** a student runs, saves, reloads a topology or opens a node console
- **THEN** those operations succeed exactly as in the full edition

### Requirement: Edition identity and coexistence
The student edition SHALL use an application identity (name shown by the window manager and used for user data storage) distinct from the full edition, so both editions can be installed and run on the same machine without sharing stored options, window bounds, or console state. The student edition SHALL display an edition badge in the header bar.

#### Scenario: Side-by-side install
- **WHEN** both editions are installed on one machine and launched
- **THEN** each runs independently with its own user data and each appears under its own name

#### Scenario: Student badge
- **WHEN** the student edition renders its header bar
- **THEN** the header shows a "Student edition" badge that the full edition does not show
