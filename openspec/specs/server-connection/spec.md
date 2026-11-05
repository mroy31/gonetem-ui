# server-connection Specification

## Purpose

Lets the user connect gonetem-ui to a gonetem server, verify the connection, and know at all times whether the app is usable.

## Requirements

### Requirement: Connect to server
The system SHALL create a gRPC client for the configured server URI and validate the connection with a version handshake, returning the server version on success.

#### Scenario: Successful connection
- **WHEN** the user requests connection and the server answers the version handshake
- **THEN** the UI shows the connection state together with the returned server version

#### Scenario: Unreachable server
- **WHEN** the user requests connection and the handshake fails
- **THEN** the connection attempt reports the failure reason and the UI stays in the disconnected state

#### Scenario: Already connected
- **WHEN** connection is requested while a client already exists
- **THEN** the system re-validates the existing client with a version handshake instead of creating a new one

### Requirement: Secure connection credentials
The system SHALL connect with mutual TLS (CA certificate, client certificate, client key read from the configured file paths) when secure mode is enabled, and with an insecure channel otherwise.

#### Scenario: Certificates unreadable
- **WHEN** secure mode is enabled and one of the certificate or key files cannot be read
- **THEN** the connection attempt fails reporting that a certificate or key could not be read

### Requirement: Connection status query
The system SHALL report whether it is connected, including the server version and the identifier of the currently open project when connected.

#### Scenario: Never connected
- **WHEN** the connection status is queried and no client has been created
- **THEN** the result reports success with connected=false and no version

### Requirement: Autoconnect on launch
The system SHALL automatically attempt a server connection at startup when autoconnect is enabled and the configured server URI is not empty.

#### Scenario: Launch with autoconnect
- **WHEN** the application starts with autoconnect enabled and a non-empty server URI
- **THEN** the system initiates a connection attempt without user action

### Requirement: Guard on server-dependent operations
Every server-dependent operation SHALL fail with a "Not connected to the server" error while no server client exists.

#### Scenario: Operation without connection
- **WHEN** any server-backed action (project, topology, node, console, image pull) is invoked with no established client
- **THEN** the action returns a failed status carrying the not-connected error and no request is sent
