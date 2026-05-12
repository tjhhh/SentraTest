## MODIFIED Requirements

### Requirement: Test Case List
The system SHALL list each individual test case from the generated suite, supporting a "pending" state (after generation), an "in-progress" state (during execution), and a "completed" state (after execution).

#### Scenario: View pending results
- **WHEN** test generation is complete but execution has not started.
- **THEN** the UI displays the list of test cases with a "pending" status indicator.

#### Scenario: Persistent list during execution
- **WHEN** the user starts the test suite execution.
- **THEN** the system SHALL maintain the visibility of the test case list.
- **AND** the system SHALL reset all existing test statuses to "pending" or "in-progress" to indicate a new run.

#### Scenario: View individual results
- **WHEN** test execution is complete.
- **THEN** the UI updates the individual test case items with their specific outcome (pass/fail) and execution time.
