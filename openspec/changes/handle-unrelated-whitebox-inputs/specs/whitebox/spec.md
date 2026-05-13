## ADDED Requirements

### Requirement: UI-Logic Relationship Validation
The system SHALL validate the relationship between the provided UI code and JavaScript logic before attempting to generate test cases.

#### Scenario: Refusal for unrelated inputs
- **WHEN** the user provides UI code and Logic code that share no common identifiers (IDs, classes) or functional dependencies.
- **THEN** Gemini returns a "refusal" response instead of a test script.
- **AND** the backend passes this refusal message to the frontend.

### Requirement: User Feedback for Generation Refusal
The frontend SHALL display a clear and helpful explanation when the generation is refused due to unrelated inputs.

#### Scenario: Display refusal message in Sandbox
- **WHEN** the backend returns a "refusal" response.
- **THEN** the frontend displays a warning alert containing the explanation provided by the AI.
- **AND** the "Run Suite" button remains disabled as no script was generated.
