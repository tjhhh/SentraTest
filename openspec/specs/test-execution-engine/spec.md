## MODIFIED Requirements

### Requirement: Playwright Script Execution
The system SHALL accept generated test scenarios, convert them into runnable Playwright scripts, execute them, and report results using structured logging (e.g., [STEP: XXX]) and visual capture.

#### Scenario: Execute with Visual Evidence
- **WHEN** user clicks "Run Test".
- **THEN** the system executes the script in a sandboxed environment (e.g., spawning a child process to run `npx playwright test`).
- **AND** the system captures structured logs and screenshots for every major interaction.
- **AND** the system streams results back to the frontend line by line until completion for visual rendering.
