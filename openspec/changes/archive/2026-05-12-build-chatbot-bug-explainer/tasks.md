## 1. Database — Search Index & Repository Extensions

- [x] 1.1 Create `backend/migrations/003_add_messages_search_index.sql` — GIN full-text search index on `messages(content)`
- [x] 1.2 Add `updateChatTitle(chatId, title)` function to `repository.js`
- [x] 1.3 Add `searchChatMessages(userId, keyword, limit, offset)` function to `repository.js` — full-text search across messages, returning matching chat sessions

## 2. Chat Route — AI Integration

- [x] 2.1 Modify `POST /api/chats` in `chats.js` — add static welcome message as first assistant message on new chat creation
- [x] 2.2 Modify `POST /api/chats/:chatId/messages` in `chats.js` — when `role` is omitted or `user`, call `aiService.chat()` to get AI reply and return both user message ID and assistant reply
- [x] 2.3 Add `PATCH /api/chats/:id` in `chats.js` — rename chat session title with validation

## 3. Bug Explainer Route

- [x] 3.1 Add `POST /api/chats/:chatId/explain-bug` in `chats.js` — accept `{ userId, errorLog }`, call `aiService.explainBug()`, save error log as user message, save AI response as assistant message, return structured explanation

## 4. Chat Search Route

- [x] 4.1 Add `GET /api/chats/search` in `chats.js` — accept `userId` and `q` query params, call repository search function, return matching chat sessions with relevance

## 5. Unit & Integration Tests

- [x] 5.1 Create `backend/tests/routes/chats.integration.test.js` — test new chat with welcome message, AI message flow, rename, delete, search, and bug explainer endpoints
- [x] 5.2 Test error handling — missing API key graceful degradation, invalid inputs, empty search results
