## ADDED Requirements

### Requirement: Automatic Screenshot Capture
The system SHALL capture a screenshot of the browser state at the end of each test case.

#### Scenario: Save screenshot on test end
- **WHEN** a test case finishes.
- **THEN** Playwright saves a PNG file to the `/screenshots` directory.

### Requirement: Visual Evidence Gallery
The system SHALL display the captured screenshots in the frontend results panel.

#### Scenario: Show evidence
- **WHEN** test execution is complete.
- **THEN** the frontend displays a gallery of screenshots corresponding to the test cases.
