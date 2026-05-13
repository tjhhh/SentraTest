# Domain: AI Chatbot & Bug Explainer

## Requirements

### Requirement: Contextual Q&A
Sistem HARUS menyediakan antarmuka chat yang memiliki konteks terhadap test case yang sedang dibuka.

#### Scenario: Asking about Test Case
- GIVEN pengguna sedang melihat sebuah test case BVA
- WHEN pengguna bertanya "Mengapa nilai ini diuji?" via chatbox
- THEN Gemini API menjawab berdasarkan konteks test case tersebut

### Requirement: Bug Explainer
Sistem HARUS bisa menjelaskan pesan error dari terminal/log.

#### Scenario: Error Analysis
- GIVEN pengguna menempelkan pesan error (stack trace) ke chatbox
- WHEN pengguna meminta penjelasan
- THEN sistem menganalisis error tersebut
- AND memberikan kemungkinan penyebab dan saran perbaikan

## Detailed User Journey Scenarios

### Scenario: Complete Contextual Q&A Session

**Context**: User is viewing a Boundary Value Analysis test case for a "calculateDiscount" function with parameters: price (0-1000), quantity (1-100), discountRate (0-50%).

**User Journey**:
1. **Open Test Case**: User navigates to test case detail page showing BVA test cases
2. **Initiate Chat**: User clicks "Ask AI" button or chat icon next to test case
3. **Context Injection**: System automatically includes test case metadata in chat context:
   - Test case type: BVA
   - Function: calculateDiscount
   - Parameters and ranges
   - Current test values being displayed
4. **User Question**: User types "Why are we testing price=100 specifically?"
5. **AI Processing**:
   - System sends prompt to Gemini API with context
   - Prompt includes: test case details, BVA methodology explanation, specific value analysis
6. **Response Display**: AI responds with explanation like:
   > "Price=100 is a boundary value because it's the threshold where discount rates change. In BVA, we test exact boundary values (99, 100, 101) to catch off-by-one errors in conditional logic."
7. **Follow-up Interaction**: User can ask more questions, and context persists throughout the conversation
8. **Save Conversation**: User can save the chat session for future reference

**API Flow**:
```
Frontend → POST /api/chats/:chatId/messages
  Body: { userId, content: "Why price=100?", context: { testCaseId, type: "BVA" } }
Backend → AI Service → Gemini API
  Prompt: "Context: BVA test case for calculateDiscount... Question: Why price=100?"
Response → Frontend displays streaming response
```

### Scenario: Bug Explanation with Context

**Context**: User encounters a JavaScript error in their test execution.

**User Journey**:
1. **Error Encounter**: User sees error in terminal or test results:
   ```
   TypeError: Cannot read property 'length' of undefined
       at calculateDiscount (/app/src/utils.js:45:12)
       at testBoundaryValues (/app/tests/discount.test.js:23:5)
   ```
2. **Initiate Bug Explainer**: User clicks "Explain Bug" button or pastes error into chat
3. **Context Gathering**: System prompts for additional context:
   - Programming language (auto-detected from stack trace)
   - Code snippet around error line
   - Test case being executed
4. **AI Analysis**: System sends to Gemini with structured prompt:
   - Error type and message
   - Stack trace
   - Code context
   - Testing context
5. **Detailed Response**: AI provides:
   - Root cause analysis
   - Code fix suggestions
   - Prevention tips
   - Related testing best practices
6. **Interactive Follow-up**: User can ask for code examples or clarification

**API Flow**:
```
Frontend → POST /api/bug/explain
  Body: { stackTrace: "...", context: "Testing discount calculation", language: "javascript" }
Backend → AI Service → Gemini API
  Structured prompt with error analysis template
Response → Frontend displays formatted explanation with code blocks
```

### Scenario: Chat History and Continuity

**Context**: User returns to a previous conversation about test case analysis.

**User Journey**:
1. **View Chat History**: User sees list of previous conversations in sidebar
2. **Resume Conversation**: User clicks on "BVA Analysis - calculateDiscount"
3. **Context Restoration**: System loads full conversation history
4. **Continued Context**: If user is still viewing the same test case, context remains active
5. **Seamless Continuation**: User can pick up where they left off

**Data Flow**:
- Conversations stored in database with userId
- Messages linked to chat sessions
- Context metadata persisted with conversations
- Automatic cleanup of old conversations (configurable retention)

### Edge Cases and Error Handling

#### Scenario: AI Service Unavailable
- WHEN Gemini API is down or rate limited
- THEN system shows queue position and estimated wait time
- AND allows user to continue with local help or retry later

#### Scenario: Invalid Error Format
- WHEN user pastes malformed error log
- THEN AI attempts to parse anyway and asks for clarification if needed

#### Scenario: Context Loss
- WHEN user navigates away from test case during chat
- THEN system warns about potential context loss
- AND offers to include current page context

### Performance Requirements

- **Response Time**: Initial response within 3 seconds for simple questions
- **Streaming**: Real-time response streaming for longer explanations
- **Queue Management**: Handle concurrent users with fair queuing
- **Caching**: Cache common questions and responses
- **Offline Capability**: Basic help available without AI when service is down

### Integration Points

- **Test Case Viewer**: Automatic context injection when chat opened from test case
- **Test Results**: Direct "Explain Error" buttons on failed tests
- **Terminal Integration**: Copy-paste error logs with one click
- **Code Editor**: Highlight relevant code lines in explanations

## Design Decisions

### Context Storage Strategy
**Decision**: Context should be stored with the conversation, not injected fresh each time.

**Rationale**: 
- Ensures conversation continuity even when navigating away from test cases
- Allows resuming conversations with full context
- Enables better AI responses based on conversation history
- Supports offline access to contextual information

**Implementation**: Store context metadata as JSON in the conversations table, updated on each context-relevant interaction.

### Chat History Retention
**Decision**: Keep chat history while user saves it (manual deletion model).

**Rationale**:
- Privacy: Users control their own data retention
- Storage: Avoids complex automated cleanup policies
- Flexibility: Users can keep important conversations indefinitely
- Simplicity: No background jobs or retention logic needed

**Implementation**: Conversations persist until explicitly deleted by user. No automatic expiration.

### Cross-Conversation Search
**Decision**: Users should be able to search across all their conversations.

**Rationale**:
- Discoverability: Find relevant past discussions easily
- Knowledge reuse: Reference previous AI explanations
- Productivity: Avoid re-asking similar questions
- User experience: Expected feature in chat applications

**Implementation**: Full-text search across message content and conversation titles, scoped to user.

### Handling Deleted Test Cases
**Decision**: When a test case is deleted but chat references it, user should provide/create context again.

**Rationale**:
- Data integrity: Avoid dangling references to deleted entities
- User control: Let users decide how to handle orphaned conversations
- Simplicity: No complex cascade delete or reference tracking
- Flexibility: Users can recreate context or start fresh conversations

**Implementation**: 
- Store context as snapshot/copy, not foreign key reference
- When context becomes stale, prompt user to refresh or continue without context
- Allow users to manually update conversation context