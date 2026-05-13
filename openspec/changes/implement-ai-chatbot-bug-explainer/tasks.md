## 1. Database Schema Updates

- [x] 1.1 Add context JSON field to Conversation model in Prisma schema
- [x] 1.2 Create and run database migration for context field
- [x] 1.3 Update Prisma client generation

## 2. Backend Context Management

- [x] 2.1 Extend conversation repository with context storage/retrieval methods
- [x] 2.2 Update chat API to accept and store context metadata
- [x] 2.3 Modify AI service chat function to use stored context
- [x] 2.4 Implement conversation search functionality in repository

## 3. Backend Search Implementation

- [x] 3.1 Add full-text search indexes to conversation and message tables
- [x] 3.2 Implement search API endpoint for conversations
- [x] 3.3 Add search query builder with user scoping
- [x] 3.4 Test search functionality with sample data

## 4. Frontend Context Injection

- [ ] 4.1 Add "Ask AI" button component to test case detail page
- [ ] 4.2 Implement context extraction from test case data
- [ ] 4.3 Create context passing mechanism to chat interface
- [ ] 4.4 Update chat service to handle context parameters

## 5. Frontend Chat Enhancements

- [ ] 5.1 Update chat UI to display context information
- [ ] 5.2 Implement conversation search in sidebar
- [ ] 5.3 Add search input and results display components
- [ ] 5.4 Update conversation store with search functionality

## 6. Bug Explainer Integration

- [ ] 6.1 Add "Explain Bug" button to test result error displays
- [ ] 6.2 Create bug explainer modal/form component
- [ ] 6.3 Integrate bug explanation API with chat interface
- [ ] 6.4 Add error log formatting and context capture

## 7. Conversation Management UI

- [ ] 7.1 Implement conversation context display in chat header
- [ ] 7.2 Add context refresh/update functionality
- [ ] 7.3 Update conversation list with context indicators
- [ ] 7.4 Add conversation deletion with context cleanup

## 8. Testing and Validation

- [ ] 8.1 Add unit tests for context storage and retrieval
- [ ] 8.2 Test conversation search with various query types
- [ ] 8.3 Validate context injection from test case viewer
- [ ] 8.4 Test bug explainer integration end-to-end

## 9. Documentation and Cleanup

- [ ] 9.1 Update API documentation for new endpoints
- [ ] 9.2 Add frontend component documentation
- [ ] 9.3 Update user-facing help text for AI features
- [ ] 9.4 Clean up any temporary code or debug artifacts