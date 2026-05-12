## ADDED Requirements

### Requirement: AI Chat Assistant — Route Integration
The system SHALL provide an HTTP API for AI-powered chat conversations.

#### Scenario: Send message and receive AI reply
- **WHEN** a user sends `POST /api/chats/:chatId/messages` with `{ userId, content }`
- **THEN** the system SHALL save the user message to the database
- **AND** call the AI service `chat()` function with conversation context
- **AND** save the AI-generated reply to the database
- **AND** return both the user message ID and the assistant reply in the response

#### Scenario: Welcome message on new chat
- **WHEN** a user creates a new chat session via `POST /api/chats`
- **THEN** the system SHALL create the chat record in the database
- **AND** insert a static welcome message as the first assistant message
- **AND** return the chat ID and welcome message in the response

#### Scenario: Contextual follow-up conversation
- **WHEN** a user sends a follow-up message in an existing chat
- **THEN** the AI service SHALL load the last 10 messages from the session as context
- **AND** the AI reply SHALL be relevant to the prior conversation
- **AND** the conversation history SHALL be persisted in the database

### Requirement: Multi-Session Management
The system SHALL support managing multiple chat sessions per user.

#### Scenario: List chat sessions
- **WHEN** a user requests `GET /api/chats?userId=`
- **THEN** the system SHALL return all chat sessions for that user ordered by `updated_at` DESC
- **AND** support pagination via `limit` and `offset` query params

#### Scenario: Rename chat session
- **WHEN** a user sends `PATCH /api/chats/:id` with `{ title }`
- **THEN** the system SHALL update the chat title in the database
- **AND** update the `updated_at` timestamp
- **AND** return the updated chat record

#### Scenario: Delete chat session
- **WHEN** a user sends `DELETE /api/chats/:id`
- **THEN** the system SHALL delete all messages in the session (cascade)
- **AND** delete the chat record
- **AND** return 204 No Content

### Requirement: Bug Explainer Endpoint
The system SHALL provide a dedicated endpoint for AI-powered error log explanation.

#### Scenario: Explain error log
- **WHEN** a user sends `POST /api/chats/:chatId/explain-bug` with `{ userId, errorLog }`
- **THEN** the system SHALL save the error log as a user message
- **AND** call the AI service `explainBug()` function with the error log
- **AND** save the structured AI explanation as an assistant message
- **AND** return the structured explanation (errorExplanation, possibleCauses, debuggingSteps, codeFixExamples)

#### Scenario: Explain build failure
- **WHEN** a user submits a build error message via the bug explainer
- **THEN** the AI SHALL analyze the error and provide a structured response
- **AND** include cause identification, debugging steps, and code fix examples

#### Scenario: Explain runtime error
- **WHEN** a user describes a runtime error via the bug explainer
- **THEN** the AI SHALL provide a simplified technical explanation
- **AND** suggest reproduction steps and fix approaches

### Requirement: Chat History Search
The system SHALL support searching across chat message content.

#### Scenario: Search chat messages
- **WHEN** a user sends `GET /api/chats/search?userId=&q=`
- **THEN** the system SHALL search message content using PostgreSQL full-text search
- **AND** return matching chat sessions with relevant message snippets
- **AND** results SHALL be ordered by relevance

#### Scenario: Search with no results
- **WHEN** a user searches for a keyword with no matches
- **THEN** the system SHALL return an empty results array
- **AND** return 200 with `{ data: [], total: 0 }`

### Requirement: Conversation Persistence
The system SHALL persist all chat conversations to the database.

#### Scenario: Resume previous conversation
- **WHEN** a user loads an existing chat session via `GET /api/chats/:chatId/messages`
- **THEN** the system SHALL return all messages in chronological order
- **AND** support pagination for long conversations (limit 100, offset)
- **AND** the user SHALL be able to continue the conversation by sending new messages

#### Scenario: Message history after restart
- **WHEN** the application restarts
- **THEN** all previous chat sessions and messages SHALL be available
- **AND** users SHALL be able to continue any previous conversation
