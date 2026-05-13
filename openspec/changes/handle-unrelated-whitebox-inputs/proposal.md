## Why

Currently, the whitebox generator might attempt to produce test scripts even if the provided UI and logic code are completely unrelated, leading to nonsensical tests or execution errors. We need to add a validation layer where Gemini refuses generation if no relationship is found, and the frontend communicates this clearly to the user.

## What Changes

- **Refusal Mechanism**: Update the backend logic and AI prompt to support a "refusal" state when UI and Logic are unrelated.
- **Data Contract Update**: Add a `refusal` field to the generation response to carry the explanation.
- **Frontend Refusal UI**: Implement a specialized warning message in the frontend to display the refusal explanation instead of a generic crash or empty state.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `whitebox`: Add a requirement for UI-Logic relationship validation and refusal handling.

## Impact

- **Backend**: `whitebox.service.js` (prompt and parsing logic), `whitebox.controller.js`.
- **Frontend**: `WhiteboxPage.tsx` (state and rendering).
