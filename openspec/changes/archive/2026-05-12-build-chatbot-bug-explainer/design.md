## Context

SentraTest has a complete AI service layer (`backend/src/ai/`) with `chat()`, `explainBug()`, and `generateTestCases()` functions that handle Gemini API calls, queuing, rate limiting, caching, and context management. The data layer has `chats` and `messages` tables with full CRUD via `repository.js`. The existing `chats.js` route provides basic CRUD endpoints but does not call the AI service — messages are stored but never processed by AI.

This change connects the existing AI and data layers to deliver two user-facing features: an AI chat assistant and a bug explainer.

## Goals / Non-Goals

**Goals:**
- Wire the AI service `chat()` function into the chat message endpoint so every user message automatically gets an AI reply
- Add a welcome message when creating a new chat session
- Add a dedicated bug explainer endpoint for structured error analysis
- Add chat session rename/update support
- Add full-text search across chat history
- Add a migration for the messages search index

**Non-Goals:**
- Frontend/UI implementation (backend-only in this change)
- WebSocket real-time messaging (HTTP request/response is sufficient for V1)
- Streaming AI responses (requires WebSocket, deferred)
- Chat archiving (simple delete is sufficient for V1)
- Auto-generated chat titles from AI (titles are user-provided or default)

## Decisions

### 1. Integrate AI into existing message endpoint vs. new endpoint
**Decision**: Modify `POST /chats/:chatId/messages` — when `role` is omitted or `user`, the route calls `aiService.chat()` which saves both the user message and the AI reply. When `role` is explicitly `assistant`, it stores the message directly (for system/welcome messages).
**Rationale**: Keeps the API simple — one endpoint for sending messages. The AI integration is transparent to the client.
**Alternatives considered**: Separate `/chats/:chatId/ai-message` endpoint (adds unnecessary endpoint proliferation).

### 2. Dedicated bug explainer endpoint
**Decision**: Add `POST /api/chats/:chatId/explain-bug` as a distinct endpoint rather than detecting error logs in regular chat.
**Rationale**: The bug explainer uses a specialized prompt template (`buildBugExplainerPrompt`) and returns structured JSON (causes, steps, fix examples), which is different from free-form chat. A dedicated endpoint lets the frontend render the response differently.

### 3. Welcome message on chat creation
**Decision**: When creating a new chat, insert a pre-defined welcome message as the first assistant message. No AI call — the welcome text is a static template.
**Rationale**: Calling AI for a welcome message adds latency and API cost to chat creation. A static welcome is instant and predictable.

### 4. Chat search via PostgreSQL full-text search
**Decision**: Add a GIN index on `to_tsvector('english', content)` for the `messages` table. Search endpoint queries using `plainto_tsquery` and returns matching chat sessions.
**Rationale**: Consistent with the existing full-text search pattern used for `generated_test_cases`. No external search engine needed.

### 5. Session rename via PATCH
**Decision**: Add `PATCH /api/chats/:id` accepting `{ title }` to rename a chat.
**Rationale**: RESTful convention for partial updates. Simple and sufficient.

## Risks / Trade-offs

- **[Risk] AI response latency blocks HTTP response** → Accepted for V1. The queue system ensures ordering. Streaming/WebSocket would improve UX but adds complexity deferred to a future change.
- **[Risk] Long error logs exceed Gemini token limits** → Mitigation: The `buildBugExplainerPrompt` template wraps the log in code fences, and Gemini handles truncation gracefully. A future enhancement could pre-truncate very long logs.
- **[Risk] Full-text search on messages may be slow for large datasets** → Mitigation: GIN index provides sub-100ms query times. Pagination limits result set size.
- **[Trade-off] Static welcome message vs. AI-generated** → Chose static for speed and cost. Can be upgraded later.
