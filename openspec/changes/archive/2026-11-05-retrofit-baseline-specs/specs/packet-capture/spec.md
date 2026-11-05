# Spec Delta

## Purpose

Lets the user watch live traffic on a node interface by piping the server's capture stream straight into a Wireshark window.

## ADDED Requirements

### Requirement: Stream interface capture to Wireshark
The system SHALL start a server-side capture on a numbered interface of a node, launch a local Wireshark in live-capture-from-stdin mode with a window title identifying `node@interface`, and pipe the streamed capture data into it until the stream ends.

#### Scenario: Successful capture start
- **WHEN** the user requests a capture on an interface, Wireshark is installed, and the server begins streaming
- **THEN** a Wireshark window opens for that interface and keeps updating as packets arrive

#### Scenario: Wireshark missing
- **WHEN** no Wireshark executable can be found locally
- **THEN** the request fails reporting that Wireshark is not found and no capture is started

#### Scenario: Server-side capture error
- **WHEN** the capture stream reports an error or an error-coded message
- **THEN** the Wireshark process is terminated and the failure is reported
