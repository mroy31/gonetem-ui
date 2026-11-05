# app-preferences Specification

## Purpose

Keeps user options and window geometry across application launches so the app starts the way the user left it.

## Requirements

### Requirement: Persisted user options
The system SHALL persist the server URI, autoconnect flag, TLS settings (enabled flag and certificate paths), and external console command template in local storage, and return the current values on request.

#### Scenario: Save options
- **WHEN** the user saves new options from the options dialog
- **THEN** the values are stored durably and subsequent retrievals return the new values

#### Scenario: First launch defaults
- **WHEN** options are read before anything was ever saved
- **THEN** the result contains empty server URI, autoconnect enabled, TLS disabled, and the built-in xterm command template

### Requirement: Window bounds memory
The system SHALL remember the main window bounds and restore the window at those bounds on the next launch.

#### Scenario: Restart after resize
- **WHEN** the user resizes or moves the main window and later restarts the application
- **THEN** the window opens with the last saved position and size

#### Scenario: First launch size
- **WHEN** the application launches with no saved bounds
- **THEN** the window opens at the default size of 1200x800
