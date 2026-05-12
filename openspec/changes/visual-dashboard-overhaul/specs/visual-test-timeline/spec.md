## ADDED Requirements

### Requirement: Structured Step Parsing
The system SHALL parse raw backend logs into structured test steps (e.g., Load Page, Click Button, Assertion).

#### Scenario: Display click step
- **WHEN** backend logs `[STEP: CLICK] clicking button#calc-btn`.
- **THEN** frontend displays a "Clicking button" step in the timeline with a success icon.

### Requirement: Step Status Indicators
Each step in the timeline SHALL have a visual indicator for its status (Pending, Success, Failure).

#### Scenario: Show failure step
- **WHEN** an assertion fails.
- **THEN** the timeline displays the failed step with a red error icon.
