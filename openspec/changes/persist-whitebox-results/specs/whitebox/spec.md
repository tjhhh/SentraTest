## ADDED Requirements

### Requirement: Automated Data Persistence for Whitebox Tests
The system SHALL automatically persist all relevant data from a whitebox test session to the database.

#### Scenario: Save generated test artifacts
- **WHEN** a Playwright test script is generated.
- **THEN** the system creates a `TestCase` record containing the `logicCode`, `uiCode`, and the `script` itself.

#### Scenario: Save execution results and evidence
- **WHEN** a whitebox test run completes.
- **THEN** the system creates an `Execution` record linked to the `TestCase`.
- **AND** the record includes the exit code, test statistics (total, passed, failed), duration, and a list of captured screenshot paths.

### Requirement: Historical Execution Tracking
The database schema SHALL support tracking multiple execution attempts for a single test case.

#### Scenario: Link multiple executions
- **WHEN** the user runs the same test case multiple times.
- **THEN** each run results in a new `Execution` record associated with the parent `TestCase`.
