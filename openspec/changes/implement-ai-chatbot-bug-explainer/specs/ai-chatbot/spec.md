# Domain: AI Chatbot

## ADDED Requirements

### Requirement: Contextual Q&A
The system SHALL provide an AI chatbot interface that maintains context from the current test case being viewed.

#### Scenario: Ask about Test Case Context
- **WHEN** user is viewing a Boundary Value Analysis test case and asks "Why are we testing price=100 specifically?"
- **THEN** the AI SHALL respond with an explanation based on the test case context, including BVA methodology and the specific boundary value analysis

#### Scenario: Context Persistence
- **WHEN** user continues the conversation with follow-up questions
- **THEN** the AI SHALL maintain the test case context throughout the conversation session

#### Scenario: Context Injection from Test Case Viewer
- **WHEN** user clicks "Ask AI" button on a test case detail page
- **THEN** the system SHALL automatically inject test case metadata (type, parameters, values) into the chat context

### Requirement: Conversation History
The system SHALL persist chat conversations with full message history.

#### Scenario: Message Persistence
- **WHEN** user sends a message and receives a response
- **THEN** both the user message and AI response SHALL be saved to the database

#### Scenario: Conversation Continuity
- **WHEN** user returns to a previous conversation
- **THEN** the system SHALL load and display the full message history

#### Scenario: Conversation Management
- **WHEN** user creates, renames, or deletes conversations
- **THEN** the system SHALL persist these changes and maintain referential integrity

### Requirement: Cross-Conversation Search
The system SHALL allow users to search across all their conversations.

#### Scenario: Search by Content
- **WHEN** user searches for "boundary value" in their conversations
- **THEN** the system SHALL return all conversations containing that term in titles or messages

#### Scenario: Search Results Display
- **WHEN** search returns results
- **THEN** the system SHALL display conversation titles with matching message previews and highlight search terms