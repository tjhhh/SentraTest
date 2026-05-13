## Context

The frontend assistant page was reverted to a mock state using `setTimeout` because the previous API integration was fragile when handling unexpected AI response formats. We need to restore the API integration and make the response handling robust.

## Goals / Non-Goals

**Goals:**
- Restore the `fetch` calls to the backend API (`/api/chats`, `/api/chats/:id/messages`, `/api/chats/:id/explain-bug`).
- Support both plain string and structured object responses in the `explanation` field.
- Prevent uncaught errors from breaking the UI by catching fetch failures and displaying them as chat messages.

**Non-Goals:**
- Modifying the backend API or the AI service prompt to force a specific structure.
- Redesigning the UI layout.

## Decisions

- **Runtime Type Checking**: In the frontend, we will check `typeof data.explanation`.
  - If it is a `'string'`, we will display it directly.
  - If it is an `'object'`, we will safe-access `errorExplanation`, `possibleCauses`, and `debuggingSteps` with fallback defaults (e.g., `'Not provided'`).
- **Graceful Error Handling**: Instead of `throw new Error('API request failed')` without a catch, we will wrap the fetch calls in a try-catch block and, on failure, add a message from the 'assistant' stating that communication failed, rather than leaving the user with no response or a broken UI.

## Risks / Trade-offs

- [Risk] The AI might return an object with different keys than expected.
  - [Mitigation] If it is an object but doesn't have the expected keys, we will fallback to displaying the stringified JSON or a generic message so the user at least sees the raw output instead of `undefined`.
