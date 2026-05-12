## 1. Project Setup & Dependencies

- [x] 1.1 Install `@google/generative-ai` npm package
- [x] 1.2 Add `GEMINI_API_KEY` and `GEMINI_MODEL` to `.env` and `.env.example`
- [x] 1.3 Create `backend/src/ai/` directory structure

## 2. Gemini API Client

- [x] 2.1 Create `backend/src/ai/geminiClient.js` — SDK initialization with API key validation, model config (temperature 0.7, maxOutputTokens 2048), and `generateContent` wrapper with retry logic (3 attempts, exponential backoff)

## 3. Prompt Engineering Templates

- [x] 3.1 Create `backend/src/ai/promptTemplates.js` — BVA prompt template function with strict JSON output format, test case ID pattern, and examples
- [x] 3.2 Add ECP prompt template function — equivalence class identification with valid/invalid classes
- [x] 3.3 Add White-box analysis prompt template function — source code analysis for statement/branch/path coverage
- [x] 3.4 Add Bug Explainer prompt template function — error explanation in Bahasa Indonesia with structured JSON output

## 4. Response Parsing & Validation

- [x] 4.1 Create `backend/src/ai/responseValidator.js` — JSON extraction from AI responses (strip markdown fences, extract from prose)
- [x] 4.2 Add test case schema validation — check required fields (id, title, steps, expectedResult), non-empty, ID format pattern
- [x] 4.3 Add programmatic fix logic — fill missing defaults, fix ID format, return corrected results with warnings
- [x] 4.4 Add fallback mechanism — return partial valid results when full fixing fails

## 5. Request Queue

- [x] 5.1 Create `backend/src/ai/requestQueue.js` — FIFO queue with sequential processing using promise chaining
- [x] 5.2 Add queue position tracking — expose current position and total queue length

## 6. Rate Limiter

- [x] 6.1 Create `backend/src/ai/rateLimiter.js` — sliding window counter (60 RPM default), request delay logic
- [x] 6.2 Add 429 response handling with exponential backoff

## 7. Response Cache

- [x] 7.1 Create `backend/src/ai/cache.js` — in-memory Map with MD5-based cache key (template + input), 24-hour TTL, expiry eviction on access

## 8. Conversation Context Manager

- [x] 8.1 Create `backend/src/ai/contextManager.js` — load last 10 messages from chat session, format as conversation history with role labels, session isolation

## 9. Public API Surface

- [x] 9.1 Create `backend/src/ai/index.js` — barrel module composing all AI modules, exporting `generateTestCases(type, input)`, `explainBug(errorLog)`, `chat(chatId, userId, message)`, and utility functions

## 10. Unit Tests

- [x] 10.1 Create `backend/tests/ai/promptTemplates.test.js` — verify prompt construction for all 4 templates
- [x] 10.2 Create `backend/tests/ai/responseValidator.test.js` — verify JSON parsing, validation, and fix logic
- [x] 10.3 Create `backend/tests/ai/rateLimiter.test.js` — verify rate tracking and backoff
- [x] 10.4 Create `backend/tests/ai/cache.test.js` — verify cache hit/miss/expiry behavior
- [x] 10.5 Create `backend/tests/ai/requestQueue.test.js` — verify FIFO ordering and sequential processing
