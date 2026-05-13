## Domain: UI Interaction Testing

### Requirement: DOM Interaction Scenarios
The system SHALL generate Playwright tests that simulate user interactions (click, fill, hover) based on the provided UI code.

#### Scenario: Test button click
- **WHEN** user provides a button with `id="submit"` and a corresponding JS function.
- **THEN** Gemini generates a test that clicks the button and asserts the result.

### Requirement: Visual Assertions
The system SHALL support assertions that check for visibility, text content, and CSS classes of elements.

#### Scenario: Check success message
- **WHEN** an action should trigger a success message.
- **THEN** Playwright asserts that the element with class `.success` is visible.
