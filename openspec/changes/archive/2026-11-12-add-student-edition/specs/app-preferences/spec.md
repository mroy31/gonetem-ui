# Spec Delta

## MODIFIED Requirements

### Requirement: Persisted user options
In the full edition, the system SHALL persist the server URI, autoconnect flag, TLS settings (enabled flag and certificate paths), and external console command template in local storage, and return the current values on request. The student edition provides no options dialog, SHALL return the build-time configuration on request without reading persisted user options, and SHALL NOT accept option writes.

#### Scenario: Save options
- **WHEN** the user saves new options from the options dialog
- **THEN** the values are stored durably and subsequent retrievals return the new values

#### Scenario: First launch defaults
- **WHEN** options are read before anything was ever saved
- **THEN** the result contains empty server URI, autoconnect enabled, TLS disabled, and the built-in xterm command template
