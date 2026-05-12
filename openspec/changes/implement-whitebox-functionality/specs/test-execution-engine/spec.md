## ADDED Requirements

### Requirement: Sandbox Execution
The system SHALL execute the generated Playwright scripts in a separate process or isolated environment to prevent code injection or system compromise.

#### Scenario: Run user script
- **WHEN** user triggers "Run Test".
- **THEN** backend spawns a child process to run `npx playwright test`.

### Requirement: Real-time Log Streaming
The system SHALL capture stdout and stderr from the test runner and stream it to the frontend.

#### Scenario: Stream test output
- **WHEN** test execution starts.
- **THEN** frontend receives logs line by line until completion.
