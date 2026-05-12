## ADDED Requirements

### Requirement: Real-time UI Sync
The system SHALL provide a live preview of the user's UI code as they type.

#### Scenario: Type HTML in editor
- **WHEN** user types `<button>Click Me</button>` in the UI editor.
- **THEN** the sandbox iframe immediately displays the button.

### Requirement: CSS/Style Support
The preview SHALL correctly render inline styles and CSS provided in the UI code block.

#### Scenario: Add red button
- **WHEN** user types `<button style="background: red">Red</button>`.
- **THEN** the preview shows a red button.
