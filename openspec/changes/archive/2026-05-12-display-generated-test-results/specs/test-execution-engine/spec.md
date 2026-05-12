## MODIFIED Requirements

### Requirement: Playwright Script Execution
The system SHALL accept generated test scenarios, convert them into runnable Playwright scripts, execute them, and report results using structured logging (e.g., [STEP: XXX]), visual capture, and a structured JSON report.

#### Scenario: Execute with Visual Evidence and JSON Report
- **WHEN** user clicks "Run Test".
- **THEN** the system executes the script in a sandboxed environment with `--reporter=json`.
- **AND** the system captures structured logs and screenshots for every major interaction.
- **AND** the system streams results back to the frontend line by line until completion.
- **AND** the system reads the generated JSON report and sends the final structured result object to the frontend.
