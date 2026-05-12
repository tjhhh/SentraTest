## Context

The `AssistantPage` is a Next.js client component (`frontend/src/app/(dashboard)/assistant/page.tsx`) that currently uses static data and `setTimeout` to simulate an AI chat experience. We have a robust AI Service Layer backend available that exposes endpoints for chat messages, chat session management, bug explanations, and chat search. The goal is to connect this frontend to those existing backend endpoints.

## Goals / Non-Goals

**Goals:**
- Replace simulated chat responses with real backend API calls.
- Fetch chat history on component mount.
- Support "Analyze Error" and "Suggest Strategy" via predefined templates.
- Support message feedback (Thumbs Up/Down).
- Implement a "Reset Conversation" action.
- Ensure smooth scrolling and loading states during API interactions.

**Non-Goals:**
- Overhauling the UI design (keep the existing layout and aesthetic).
- Implementing new backend capabilities (rely entirely on existing endpoints).
- Implementing chat session listing/switching on the sidebar (this scope is strictly the `AssistantPage` interaction flow).

## Decisions

- **State Management**: We will continue using React `useState` for local message state but will augment it to handle the `chatId`. 
  - *Rationale*: For a single chat view, local state is sufficient and avoids over-engineering with complex state libraries.
- **Initialization**: On mount, the component will attempt to fetch existing messages for a given `chatId` (if available via props/URL). If not available, it will initialize a new chat session via `POST /api/chats`.
  - *Rationale*: Ensures every chat interaction is tracked by the backend.
- **API Calls**: We will use standard `fetch` API directly within the component for HTTP requests.
  - *Rationale*: Keeps dependencies minimal and is perfectly adequate for standard REST endpoints.
- **Quick Actions**: Clicking "Analyze Error" will populate the text area with a template (e.g., "Tolong jelaskan error berikut: \n[Paste your error log here]") rather than calling the API immediately.
  - *Rationale*: Gives the user a chance to paste their specific error before sending.
- **Feedback**: Clicking Thumbs Up/Down will trigger an optimistic UI update, followed by a background `PATCH` request to the API.

## Risks / Trade-offs

- [Risk] **API Latency**: Real API calls might take longer than the 1.5s simulation, especially when the backend calls Gemini.
  → *Mitigation*: The UI already has an `isTyping` state with an animated pulse. We will ensure this is properly tied to the API promise resolution.
- [Risk] **Backend Errors**: The backend might return errors (e.g., rate limits, missing API keys).
  → *Mitigation*: Wrap API calls in `try/catch` and gracefully display an error message bubble from the "assistant" if the call fails.
