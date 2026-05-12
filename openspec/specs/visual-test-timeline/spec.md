## ADDED Requirements

### Requirement: Structured Step Parsing
The system SHALL parse raw backend logs into structured test steps (e.g., Load Page, Click Button, Assertion) and associate them with specific test cases if applicable.

#### Scenario: Display click step within test case
- **WHEN** backend logs `[STEP: CLICK] clicking button#calc-btn`.
- **THEN** frontend displays a "Clicking button" step in the timeline with a success icon.
- **AND** the step is associated with the currently executing test case from the result summary.

### Requirement: Step Status Indicators
Each step in the timeline SHALL have a visual indicator for its status (Pending, Success, Failure).

#### Scenario: Show failure step
- **WHEN** an assertion fails.
- **THEN** the timeline displays the failed step with a red error icon.
