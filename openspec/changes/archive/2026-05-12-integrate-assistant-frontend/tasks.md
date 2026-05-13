## 1. State Management & Initialization

- [x] 1.1 Add local state for `chatId`, `isLoadingHistory`, and API `error` handling.
- [x] 1.2 Implement `useEffect` to fetch chat history on component mount or initialize a new chat session via `POST /api/chats` if no history is provided.

## 2. API Integration for Chat Messages

- [x] 2.1 Replace `setTimeout` in `handleSend` with a real `fetch` POST to `/api/chats/:chatId/messages`.
- [x] 2.2 Handle error states gracefully (e.g., API failures, timeouts) and display an appropriate error message bubble in the UI.

## 3. Bug Explainer & Quick Actions

- [x] 3.1 Wire up the "Analyze Error" (Zap) button to automatically insert a predefined bug explainer template into the text area.
- [x] 3.2 Wire up the "Suggest Strategy" (Sparkles) button to insert a predefined test strategy template into the text area.
- [x] 3.3 Ensure that when sending a bug explanation prompt, the backend properly delegates to the `/api/chats/:chatId/explain-bug` endpoint if necessary (or verify standard `/messages` endpoint handles the context correctly based on design).

## 4. User Feedback Management

- [x] 4.1 Extend the message type to track user feedback state (like/dislike).
- [x] 4.2 Wire up the Thumbs Up / Thumbs Down buttons to trigger a PATCH request to the backend API to record feedback.
- [x] 4.3 Update the UI optimistically to show the recorded feedback.

## 5. Reset Conversation Logic

- [x] 5.1 Wire up the "Reset Conversation" (RotateCcw) button to clear the current local message state.
- [x] 5.2 Trigger an immediate call to `POST /api/chats` to establish a new `chatId` so subsequent messages start a fresh session.

## 6. Unit & Integration Testing

- [x] 6.1 Setup API mocking (using MSW or Jest fetch mock) to simulate responses from the backend chat and feedback endpoints.
- [x] 6.2 Create Unit Tests to validate UI state changes (`isLoadingHistory`, `isTyping`, and error message rendering).
- [x] 6.3 Create Integration Tests to validate the full user interaction flow (sending messages, triggering quick actions, and submitting feedback).
