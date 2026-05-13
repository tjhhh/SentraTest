## Why

The SentraTest application currently has AI infrastructure (Gemini API integration, prompts, rate limiting) but lacks user-facing AI features. Users need contextual help with test case analysis and bug explanation to improve their testing workflow. Implementing the AI Chatbot & Bug Explainer will provide intelligent assistance directly within the application, reducing time spent on manual research and improving user productivity.

## What Changes

- Add contextual chat interface that injects test case metadata into AI conversations
- Implement bug explanation feature that analyzes stack traces and provides detailed explanations
- Add conversation persistence with context storage for continuity
- Enable cross-conversation search functionality
- Integrate chat features into test case viewer and test results pages

## Capabilities

### New Capabilities
- `ai-chatbot`: Contextual Q&A system with test case awareness and conversation history
- `bug-explainer`: AI-powered error analysis and explanation system
- `conversation-management`: Chat session persistence, search, and context handling

### Modified Capabilities
<!-- No existing capabilities are being modified - these are new features -->

## Impact

- **Frontend**: New chat components, integration with test case viewer and test results
- **Backend**: Enhanced AI service with context handling, new chat and bug routes
- **Database**: New tables for conversations and messages with context metadata
- **Dependencies**: Existing Gemini API integration will be extended