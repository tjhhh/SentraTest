## Context

SentraTest is a test-case generation platform built with Node.js/Express (CommonJS). The data access layer is complete — PostgreSQL with 6 domain tables, connection pooling, and migration tracking. The application needs an AI service layer to power its core features: generating test cases from feature descriptions, analyzing source code, explaining bugs, and providing a conversational chatbot assistant.

The backend currently has no AI integration. Google Gemini is the chosen AI provider. The service layer will be consumed internally by existing Express route handlers (`testCases.js`, `chats.js`) — no new HTTP endpoints are introduced in this change.

**Constraints:**
- CommonJS modules (no ESM)
- No external queue systems (Redis, RabbitMQ) — in-memory only for MVP
- Gemini API free tier has rate limits (~60 RPM for gemini-pro)
- The service must work without a valid API key for development (graceful degradation)

## Goals / Non-Goals

**Goals:**
- Integrate Google Gemini SDK (`@google/generative-ai`) with proper initialization and API key validation
- Create 4 optimized prompt templates (BVA, ECP, White-box, Bug Explainer) that produce structured JSON output
- Parse and validate AI responses with fallback mechanisms for malformed output
- Implement in-memory request queue for sequential processing of concurrent AI requests
- Build a sliding-window rate limiter to stay within Gemini API limits
- Add hash-based response cache (24h TTL) to reduce redundant API calls
- Manage multi-turn conversation context with token-aware windowing

**Non-Goals:**
- HTTP endpoints or route integration (will follow in a separate change)
- UI/frontend implementation
- Persistent queue (Redis-backed) — in-memory is sufficient for single-process MVP
- Multimodal/vision features (Gemini Pro Vision) — deferred to a future change
- User-level usage limits and cost tracking database tables — deferred to future change
- Production-grade monitoring or alerting

## Decisions

### 1. `@google/generative-ai` SDK over raw HTTP
**Decision**: Use Google's official Node.js SDK for Gemini API calls.
**Rationale**: The SDK handles authentication, retries, streaming, and model version management. Raw HTTP would require manually handling all of this.
**Alternatives considered**: Direct REST API calls (more control but significant boilerplate), LangChain.js (too heavy for our use case, adds large dependency tree).

### 2. Module architecture: one file per concern
**Decision**: Structure the AI service as `backend/src/ai/` with separate files:
- `geminiClient.js` — SDK initialization, model configuration, API call wrapper with retry
- `promptTemplates.js` — All 4 prompt templates as pure functions
- `responseValidator.js` — JSON parsing, schema validation, programmatic fixing
- `requestQueue.js` — FIFO queue with sequential processing
- `rateLimiter.js` — Sliding window counter, backoff logic
- `cache.js` — In-memory hash-based cache with TTL
- `contextManager.js` — Conversation history management, token-aware windowing
- `index.js` — Public API surface, composes all modules

**Rationale**: Single-responsibility files are independently testable and easy to reason about. The `index.js` barrel file provides a clean public API.

### 3. In-memory cache with MD5 hashing
**Decision**: Cache AI responses in a `Map` keyed by MD5 hash of `(prompt_template + input)`. TTL: 24 hours. Cache eviction on expiry check.
**Rationale**: Simple, zero-dependency. For a single-process app, in-memory cache is sufficient. MD5 is fast and collision-resistant enough for cache keys (not security-sensitive).
**Alternatives considered**: Redis (overkill for MVP, adds infrastructure), LRU cache library (unnecessary complexity — our cache is small).

### 4. Sequential queue over parallel processing
**Decision**: Process AI requests one at a time from a FIFO queue.
**Rationale**: Gemini API has strict RPM limits. Sequential processing with rate limiting is the simplest way to avoid 429 errors. Queue position is exposed so callers can inform users.
**Alternatives considered**: Parallel with concurrency limit (more complex, harder to reason about rate limiting), external queue system (over-engineered for MVP).

### 5. Prompt templates return structured JSON instructions
**Decision**: All prompts explicitly instruct the AI to return JSON and include a JSON schema example in the prompt. Validation enforces the schema post-response.
**Rationale**: Gemini performs best when given explicit JSON format instructions with examples. Post-validation catches hallucinated or malformed output.

### 6. Conversation context: last 10 messages with hard limit
**Decision**: For chatbot context, include the last 10 messages from the session. If the conversation exceeds this, older messages are dropped (no summarization in V1).
**Rationale**: Summarization requires an extra API call and adds complexity. 10 messages provides enough context for most conversations. Summarization can be added later.
**Alternatives considered**: Full history (exceeds token limit), sliding summary (extra API cost and latency).

## Risks / Trade-offs

- **[Risk] Gemini API key not set during development** → Mitigation: `geminiClient.js` validates API key on init. If missing, all generation functions return a descriptive error without crashing the app.
- **[Risk] AI returns malformed JSON** → Mitigation: `responseValidator.js` attempts programmatic fixing (strip markdown fences, extract JSON from prose, fill default fields). If all fixes fail, returns partial results with a warning.
- **[Risk] In-memory cache lost on process restart** → Accepted trade-off for MVP simplicity. Cache is purely an optimization — cold cache works correctly, just slower.
- **[Risk] In-memory queue lost on crash** → Accepted. Queued requests are lost, but users can retry. For MVP, this is acceptable.
- **[Risk] Gemini model version changes** → Mitigation: Model name is configurable via environment variable (`GEMINI_MODEL`), defaulting to `gemini-pro`.
- **[Trade-off] No streaming responses** → Simplifies response validation (we need the full response to validate JSON). Streaming can be added for chatbot UX in a future change.
