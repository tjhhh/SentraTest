## Why

The frontend assistant page was recently reverted to use mock data because the previous API integration was brittle. Specifically, the frontend assumed that the backend's `/explain-bug` endpoint would always return a structured JSON object with specific keys (`errorExplanation`, `possibleCauses`, `debuggingSteps`). However, the backend passes through the AI's response, which can be a plain text string. This caused the frontend to display `undefined` values. Additionally, network errors or non-200 responses were not handled gracefully, leading to uncaught errors.

## What Changes

- **Re-integrate Backend API**: Restore the connection to `/api/chats`, `/api/chats/:id/messages`, and `/api/chats/:id/explain-bug` in the assistant page.
- **Robust Response Parsing**: Update the frontend to handle both string and object responses for the `explanation` field.
- **Improved Error Handling**: Ensure that failed API requests display a user-friendly message in the chat instead of throwing uncaught errors or leaving the UI in a broken state.

## Capabilities

### New Capabilities
None. This is a fix for an existing implementation.

### Modified Capabilities
None. The system requirements defined in `specs/assistant/Spec.md` remain unchanged; this is an implementation correction to align with the actual behavior of the AI service.

## Impact

- **Affected Code**: `frontend/src/app/(dashboard)/assistant/page.tsx`
- **APIs**: No changes to API contracts, just better handling of optional response formats in the frontend.
