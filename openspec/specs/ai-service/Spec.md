
## 10. ai-service/Spec.md

```markdown
# Domain: AI Service Layer (Gemini Integration)

## Requirements

### Requirement: Gemini API Client Initialization
The system SHALL integrate with Google Gemini AI API via the `@google/generative-ai` SDK.

#### Scenario: Successful client initialization
- **WHEN** the application starts and `GEMINI_API_KEY` environment variable is set
- **THEN** the system SHALL create a Gemini API client instance
- **AND** configure the default model (`gemini-pro`)
- **AND** set generation config: temperature 0.7, maxOutputTokens 2048

#### Scenario: Missing API key
- **WHEN** the application starts and `GEMINI_API_KEY` is not set
- **THEN** the system SHALL log a warning
- **AND** all generation functions SHALL return a descriptive error without crashing

#### Scenario: API call with retry
- **WHEN** a Gemini API call fails due to a transient error (timeout, 500, 503)
- **THEN** the system SHALL retry up to 3 times with exponential backoff (1s, 2s, 4s)
- **AND** if all retries fail, the system SHALL throw a descriptive error

### Requirement: BVA Prompt Template
The system SHALL provide an optimized prompt template for Boundary Value Analysis test case generation.

#### Scenario: Build BVA prompt
- **WHEN** the system receives a feature description, input fields, and constraints
- **THEN** the system SHALL construct a prompt that instructs the AI to generate minimum 10 BVA test cases
- **AND** the prompt SHALL specify strict JSON output format with fields: id (TC-[MODULE]-[NUMBER]), title, precondition, steps, expectedResult, type (Positive/Negative/Edge), priority (High/Medium/Low)
- **AND** the prompt SHALL include format examples for guidance

### Requirement: ECP Prompt Template
The system SHALL provide an optimized prompt template for Equivalence Class Partitioning test case generation.

#### Scenario: Build ECP prompt
- **WHEN** the system receives a feature description
- **THEN** the system SHALL construct a prompt that instructs the AI to identify valid and invalid equivalence classes
- **AND** generate representative test cases per class
- **AND** output SHALL follow the same strict JSON format as BVA

### Requirement: White-Box Analysis Prompt Template
The system SHALL provide a prompt template for white-box testing analysis of source code.

#### Scenario: Build white-box analysis prompt
- **WHEN** the system receives source code for analysis
- **THEN** the system SHALL construct a prompt that includes the full source code
- **AND** instruct the AI to analyze statement/branch/path coverage
- **AND** identify edge conditions and recommend test scenarios
- **AND** output SHALL be structured JSON with coverage analysis and test cases

### Requirement: Bug Explainer Prompt Template
The system SHALL provide a prompt template for explaining error logs in simple language.

#### Scenario: Build bug explainer prompt
- **WHEN** the system receives an error log
- **THEN** the system SHALL construct a prompt asking for: explanation of the error, possible causes, debugging steps, and code fix examples
- **AND** the response SHALL be in Bahasa Indonesia by default
- **AND** output SHALL be structured JSON

### Requirement: Response Parsing and Validation
The system SHALL parse and validate all AI-generated responses.

#### Scenario: Parse JSON response
- **WHEN** the AI returns a response
- **THEN** the system SHALL extract JSON from the response text (handling markdown code fences)
- **AND** parse it into a JavaScript object
- **AND** handle parsing errors gracefully

#### Scenario: Validate test case output
- **WHEN** a parsed test case response is received
- **THEN** the system SHALL verify all required fields exist: id, title, steps, expectedResult
- **AND** verify fields are non-empty
- **AND** verify ID format matches pattern `TC-[A-Z]+-\d+`
- **AND** return validation results with per-item pass/fail details

#### Scenario: Fallback for invalid output
- **WHEN** validation fails for an AI response
- **THEN** the system SHALL attempt programmatic fixing (fill missing fields with defaults, fix ID format)
- **AND** if fixing succeeds, return corrected results with a warning
- **AND** if fixing fails, return partial valid results with a warning listing excluded items

### Requirement: Request Queue
The system SHALL queue concurrent AI requests for sequential processing.

#### Scenario: Enqueue request
- **WHEN** multiple users submit AI generation requests concurrently
- **THEN** the system SHALL add requests to a FIFO queue
- **AND** process them sequentially (one at a time)
- **AND** return a promise that resolves when the request is processed

#### Scenario: Queue position tracking
- **WHEN** a request is enqueued
- **THEN** the system SHALL provide the current queue position
- **AND** the total queue length

### Requirement: Rate Limiting
The system SHALL manage API request rates to stay within Gemini API limits.

#### Scenario: Sliding window rate tracking
- **WHEN** the system makes Gemini API calls
- **THEN** the system SHALL track call timestamps in a sliding window (per minute)
- **AND** if the call count approaches the limit (default 60 RPM), delay subsequent requests

#### Scenario: Rate limit backoff
- **WHEN** the Gemini API returns a 429 (rate limited) response
- **THEN** the system SHALL implement exponential backoff before retrying
- **AND** log the rate limit event for monitoring

### Requirement: Response Caching
The system SHALL cache AI responses to reduce redundant API calls.

#### Scenario: Cache hit
- **WHEN** a generation request matches a previously cached input (same template + input hash)
- **THEN** the system SHALL return the cached response
- **AND** skip the API call entirely

#### Scenario: Cache miss
- **WHEN** a generation request has no cache entry
- **THEN** the system SHALL call the API, store the response in cache with a 24-hour TTL
- **AND** return the fresh response

#### Scenario: Cache expiry
- **WHEN** a cached entry exceeds 24 hours
- **THEN** the system SHALL treat it as a cache miss
- **AND** evict expired entries on access

### Requirement: Conversation Context Management
The system SHALL manage multi-turn conversation context for the chatbot.

#### Scenario: Build conversation context
- **WHEN** a user sends a message in an existing chat session
- **THEN** the system SHALL load the last 10 messages from that session
- **AND** include them as conversation history in the AI prompt
- **AND** maintain role labels (user/assistant)

#### Scenario: Session isolation
- **WHEN** a user switches between chat sessions
- **THEN** the system SHALL load context only from the target session
- **AND** ensure no cross-session context contamination

#### Scenario: Context window overflow
- **WHEN** a conversation has more than 10 messages
- **THEN** the system SHALL include only the 10 most recent messages
- **AND** drop older messages without summarization (V1)

### Requirement: Multimodal AI (UI Auditor)
Sistem HARUS support multimodal AI untuk analisis UI screenshot.

#### Scenario: Analyze UI Screenshot
- GIVEN user upload screenshot aplikasi
- WHEN sistem process dengan Gemini Pro Vision
- THEN sistem kirim image ke Gemini API
- AND sistem minta analisis: konsistensi visual, aksesibilitas, alignment, tipografi
- AND AI return recommendations dalam format terstruktur
- AND sistem display hasil dalam report

#### Scenario: Image Preprocessing
- GIVEN screenshot yang diupload
- WHEN sistem prepare untuk AI
- THEN sistem validate image format (PNG, JPG, WebP)
- AND sistem resize/compress jika terlalu besar (max 4MB)
- AND sistem convert ke base64 atau upload ke temporary storage
- AND sistem pass image URL/data ke Gemini API

### Requirement: Cost Management & Monitoring
Sistem HARUS monitor dan manage biaya API Gemini.

#### Scenario: Track API Usage
- GIVEN setiap call ke Gemini API
- WHEN request selesai
- THEN sistem log: tokens input, tokens output, model used, timestamp, user_id
- AND sistem track total tokens per user per day
- AND sistem store metrics di database untuk analytics

#### Scenario: Usage Limits per User
- GIVEN kebutuhan control biaya
- WHEN user make AI requests
- THEN sistem check user's daily/monthly usage
- AND sistem enforce limits (misal: 100 generations/day untuk free tier)
- AND sistem return error jika limit exceeded
- AND sistem notify user tentang usage

#### Scenario: Cost Optimization
- GIVEN kebutuhan minimize API cost
- WHEN sistem design AI integration
- THEN sistem implement:
- Response caching untuk reduce redundant calls
- Prompt optimization untuk minimize tokens
- Batch processing untuk efficiency
- Use cheaper model untuk simple tasks
- AND sistem monitor cost per feature
```