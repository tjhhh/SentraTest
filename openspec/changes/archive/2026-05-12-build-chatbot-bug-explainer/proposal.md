## Why

The AI service layer (Gemini client, prompt templates, response validation, queuing, caching) and the data layer (chats, messages tables) are both fully implemented, but they are not yet wired together as user-facing features. Users cannot create AI-powered chat sessions, ask testing questions with context-aware follow-ups, or paste error logs for AI-driven debugging explanations. This change connects the existing backend AI service to the chat and bug explainer routes, adds missing features (welcome message, session rename, chat search), and delivers the two core interactive features of SentraTest.

## What Changes

- **AI chat route integration**: Modify the existing `POST /api/chats/:chatId/messages` endpoint to call the AI service's `chat()` function when the role is `user`, automatically generating an assistant reply.
- **New chat with welcome message**: When creating a new chat session, the system generates a welcome message from the AI and stores it as the first assistant message.
- **Bug explainer endpoint**: Add a new `POST /api/chats/:chatId/explain-bug` endpoint that accepts an error log and returns a structured AI explanation using the `explainBug()` function.
- **Chat session rename**: Add `PATCH /api/chats/:id` to rename a chat session title.
- **Chat history search**: Add `GET /api/chats/search?userId=&q=` to search across chat message content.
- **Database migration**: Add a search index on `messages(content)` for full-text search support.

## Capabilities

### New Capabilities
- `chatbot-bug-explainer`: Covers AI chat assistant integration (contextual conversation, welcome message, multi-session management), bug explainer (error log, build failure, runtime error explanation), conversation history persistence, search, and session management (rename, delete).

### Modified Capabilities
_(none — this wires existing AI and data layers into routes without changing their spec-level behavior)_

## Impact

- **Code**: `backend/src/routes/chats.js` (major changes), `backend/src/data/repository.js` (add search/rename functions), new migration `003_add_messages_search_index.sql`
- **APIs**: Modified `POST /chats/:chatId/messages`, new `POST /chats/:chatId/explain-bug`, new `PATCH /chats/:id`, new `GET /chats/search`
- **Dependencies**: No new packages — uses existing `@google/generative-ai` via the AI service layer
- **Database**: New GIN full-text search index on `messages(content)` for chat search
