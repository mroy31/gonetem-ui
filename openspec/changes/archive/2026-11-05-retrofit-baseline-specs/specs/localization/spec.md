# Spec Delta

## Purpose

Shows the UI in the user's browser language among the supported locales, and records translation keys that are used but not yet defined so they can be filled in later.

## ADDED Requirements

### Requirement: Language selection and fallback
The UI SHALL detect the user's language and render it when it is a supported locale (English or French), falling back to English for any other language.

#### Scenario: French user
- **WHEN** a user whose browser language is French opens the UI
- **THEN** the interface renders with the French translations

#### Scenario: Unsupported language
- **WHEN** a user's detected language is neither French nor English
- **THEN** the interface renders in English

### Requirement: Translation loading through the main process
The renderer SHALL obtain translation resources from JSON locale files in the application resources, read by the main process per language and namespace, and report a load failure when a file is missing or malformed.

#### Scenario: Load locale file
- **WHEN** the renderer requests a language and namespace that exists on disk
- **THEN** the parsed translation set is returned

#### Scenario: Malformed locale file
- **WHEN** the requested locale file contains invalid JSON
- **THEN** the read reports the failure instead of returning partial data

### Requirement: Missing key recording
The UI SHALL persist every translation key used without a defined value, appending it with its fallback text to a per-language, per-namespace missing-keys file, merging into existing content without losing previously recorded keys even when many keys go missing at once.

#### Scenario: New missing keys
- **WHEN** several undefined keys are used in one session for the same language and namespace
- **THEN** each key ends up recorded with its fallback text alongside the keys already stored

#### Scenario: Missing file does not exist yet
- **WHEN** a missing key is recorded for a language and namespace with no missing-keys file yet
- **THEN** a new file is created containing just that key
