## ADDED Requirements

### Requirement: Summary Dashboard
The system SHALL provide a high-level summary of the test run, including total tests, pass count, fail count, and total duration.

#### Scenario: View test summary
- **WHEN** test execution finishes successfully.
- **THEN** the UI displays "Tests: 5 Passed, 0 Failed (12.4s)".

### Requirement: Test Case List
The system SHALL list each individual test case from the generated suite with its specific outcome and execution time.

#### Scenario: View individual results
- **WHEN** a test suite contains multiple test cases.
- **THEN** the UI displays an accordion list where each item shows the test name and a pass/fail status.
