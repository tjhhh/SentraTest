## Context

The SentraTest application has existing AI infrastructure including Gemini API integration, rate limiting, caching, and basic chat routes. The database schema includes Conversation and Message models. Frontend has conversation management with Zustand store and basic chat components. The goal is to implement contextual AI chat and bug explanation features as specified in the assistant spec.

Current state:
- Backend: AI service with chat() and explainBug() functions, conversation persistence
- Frontend: Conversation store, basic chat UI, streaming support
- Database: Conversation/Message tables with basic relationships

## Goals / Non-Goals

**Goals:**
- Implement contextual Q&A with test case awareness
- Add bug explanation feature with stack trace analysis
- Enable conversation persistence with context storage
- Provide cross-conversation search functionality
- Integrate chat features into test case viewer and test results

**Non-Goals:**
- Real-time collaboration features
- Voice input/output
- Integration with external chat platforms
- Advanced AI model customization
- Conversation export/import functionality

## Decisions

### Context Storage Strategy
**Decision**: Add `context` JSON field to Conversation model to store test case metadata.

**Rationale**: 
- Conversations need persistent context for continuity across sessions
- JSON field provides flexibility for different context types (test cases, bugs, etc.)
- Avoids complex foreign key relationships that could break with deletions
- Allows context to evolve without schema changes

**Alternatives Considered**:
- Store context in Message table: Too granular, context applies to entire conversation
- Separate Context table: Overkill for current needs, adds complexity
- Embed context in message content: Makes parsing difficult, not structured

### Context Injection Points
**Decision**: Add "Ask AI" buttons to test case detail pages and test result error displays.

**Rationale**:
- Direct integration where users need contextual help
- Maintains existing navigation patterns
- Allows context to be automatically captured from current page state

**Implementation**:
- Test case viewer: Extract test case metadata (type, parameters, values)
- Test results: Include error context and test case information
- Context passed via URL parameters or local storage to chat interface

### Search Implementation
**Decision**: Implement full-text search across conversation titles and message content using database FTS.

**Rationale**:
- PostgreSQL has built-in full-text search capabilities
- Efficient for user-scoped search
- No additional infrastructure needed
- Supports relevance ranking

**Alternatives Considered**:
- Client-side search: Poor performance with large conversation history
- External search service: Overkill for current scale
- Simple LIKE queries: Less accurate, no ranking

### Bug Explainer Integration
**Decision**: Extend existing chat interface to support bug explanation mode.

**Rationale**:
- Reuses existing conversation and streaming infrastructure
- Maintains consistent UI/UX
- Allows follow-up questions on bug explanations
- Integrates with conversation history

**Implementation**:
- Add "Explain Bug" button that opens chat with special context
- Pre-populate conversation with error log
- Use existing explainBug API endpoint

## Risks / Trade-offs

**Context Staleness** → User must refresh context when test cases change. Trade-off: Avoids complex sync logic vs manual refresh burden.

**Search Performance** → FTS on large message tables could be slow. Mitigation: Implement pagination and user-scoped queries.

**Context Size Limits** → Large test case data in JSON could exceed column limits. Mitigation: Store minimal context, reconstruct from IDs when needed.

**API Rate Limits** → AI service has rate limiting, could affect user experience. Mitigation: Show queue status, implement client-side throttling.

**Data Privacy** → Conversation content contains sensitive test data. Mitigation: User-controlled deletion, no external sharing.