## Why

SentraTest's core value proposition is AI-powered test case generation, but the backend currently has no AI integration. The data access layer is complete — all six database tables, connection pooling, and migrations are in place. The next critical step is building the AI service layer that connects to Google Gemini to generate test cases (BVA, ECP, White-box), explain bugs, and power the chatbot assistant. Without this layer, the application cannot deliver its primary feature.

## What Changes

- **Gemini API client**: Initialize and configure the `@google/generative-ai` SDK with API key validation, model selection (gemini-pro for text, gemini-pro-vision for multimodal), and generation config (temperature, maxOutputTokens).
- **Prompt engineering templates**: Create structured, optimized prompt templates for BVA, ECP, White-box analysis, and Bug Explainer use cases — each producing strict JSON output.
- **Response parsing & validation**: Parse AI responses into structured JSON, validate required fields (id, title, steps, expectedResult), validate ID format (`TC-[A-Z]+-\d+`), and implement fallback mechanisms (programmatic fix or regeneration).
- **Request queuing**: Build an in-memory FIFO queue that processes AI requests sequentially to respect API concurrency limits, with queue position tracking.
- **Rate limiting**: Track API calls per minute with a sliding window counter, delay requests when approaching limits, and implement exponential backoff on 429 responses.
- **Response caching**: Hash-based lookup cache with 24-hour TTL to avoid redundant API calls for identical inputs.
- **Conversation context management**: Maintain multi-turn chat context with token-aware windowing (last 10 messages), session isolation, and context summarization for long conversations.

## Capabilities

### New Capabilities
- `ai-service`: Covers Gemini API integration, prompt templates (BVA/ECP/White-box/Bug Explainer), response parsing and validation, request queuing, rate limiting, response caching, and conversation context management.

### Modified Capabilities
_(none — this is a new service layer with no changes to existing specs)_

## Impact

- **Code**: New files under `backend/src/ai/` — `geminiClient.js`, `promptTemplates.js`, `responseValidator.js`, `requestQueue.js`, `rateLimiter.js`, `cache.js`, `contextManager.js`, `index.js`
- **Dependencies**: `@google/generative-ai` (new npm package), `crypto` (Node.js built-in for cache hashing)
- **Environment**: New `GEMINI_API_KEY` environment variable required in `.env`
- **APIs**: No new HTTP endpoints in this change — the AI service is consumed internally by route handlers. Routes will integrate in a follow-up change.
- **Database**: Uses existing `repository.js` functions for storing generated test cases and loading chat history
