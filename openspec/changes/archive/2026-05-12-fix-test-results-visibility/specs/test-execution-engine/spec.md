## MODIFIED Requirements

### Requirement: Playwright Script Execution
The system SHALL accept generated test scenarios, convert them into runnable Playwright scripts, execute them, and report results using structured logging (e.g., [STEP: XXX]), visual capture, and a structured JSON report delivered via a robust response stream.

#### Scenario: Execute with Visual Evidence and JSON Report
- **WHEN** user clicks "Run Test".
- **THEN** the system executes the script in a sandboxed environment with `--reporter=json`.
- **AND** the system captures structured logs and screenshots for every major interaction.
- **AND** the system SHALL stream results back to the frontend using a robust line-buffering mechanism to ensure fragmented network chunks are correctly reassembled.
- **AND** the system SHALL parse the final `[RESULT: JSON]` marker from the reassembled stream to update the UI with structured results.
