## ADDED Requirements

### Requirement: JSON Report Transformation
The system SHALL parse Playwright's JSON reporter output into a simplified internal format suitable for the frontend.

#### Scenario: Parse successful run
- **WHEN** backend reads a valid `test-results.json` file.
- **THEN** it returns an object containing an array of test results with `title`, `status`, `duration`, and `error` fields.

### Requirement: Error Context Extraction
The system SHALL extract stack traces and error messages from failed test cases in the JSON report.

#### Scenario: Parse failed test
- **WHEN** a test case in the JSON report has `status: 'failed'`.
- **THEN** the system extracts the `message` and `stack` to be displayed in the UI.
