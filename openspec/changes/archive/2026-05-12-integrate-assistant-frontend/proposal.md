## Why

The `AssistantPage` component currently relies on static mock data and `setTimeout` to simulate AI interactions. With the backend AI Service Layer and Chatbot API now complete, we need to integrate the frontend to enable real, contextual conversations, bug explanations, and user feedback, turning the mockup into a fully functional testing assistant.

## What Changes

- Replace `setTimeout` simulation in `handleSend` with real HTTP POST requests to `/api/chats/:chatId/messages`.
- Fetch and display existing chat history when the component mounts, or initialize a new chat session if none exists.
- Wire up the "Analyze Error" and "Suggest Strategy" quick action buttons to populate the text area with predefined prompt templates.
- Implement Thumbs Up / Thumbs Down feedback buttons to send `PATCH` requests to the backend API.
- Implement the "Reset Conversation" button to clear the current message state and initiate a new chat session ID with the backend.
- Add robust error handling and loading states for API interactions.
- Implement comprehensive unit and integration tests to validate UI state changes and full user interaction flows using API mocking.

## Capabilities

### New Capabilities

### Modified Capabilities

## Impact

- **Affected Code**: `frontend/src/app/(dashboard)/assistant/page.tsx`
- **APIs**: Will consume backend endpoints `POST /api/chats`, `POST /api/chats/:chatId/messages`, `POST /api/chats/:chatId/explain-bug`, and feedback endpoints.
