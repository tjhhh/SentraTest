## ADDED Requirements

### Requirement: Data Access Repository Layer
The system SHALL provide a unified repository module for PostgreSQL interactions using `pg-pool`. All database operations MUST be performed via parameterised queries, support pagination, full‑text search for test cases, and transaction utilities. The repository MUST expose functions for each domain entity (users, chats, messages, generated_test_cases, uploaded_files, export_history) and centralised error handling.

#### Scenario: Initialise Connection Pool
- **WHEN** the application starts
- **THEN** the repository initialises a `Pool` using environment variables `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE` with a maximum of 20 connections.
- **AND** the pool is ready to serve queries.

#### Scenario: Create User Record
- **WHEN** `createUser(email, username, passwordHash)` is called
- **THEN** the repository executes a parameterised `INSERT INTO users (email, username, password_hash, created_at, updated_at) VALUES ($1, $2, $3, NOW(), NOW()) RETURNING id`.
- **AND** the function returns the newly created user ID.

#### Scenario: Paginated Retrieval of Test Cases
- **WHEN** `listTestCases(userId, limit, offset)` is called
- **THEN** the repository runs `SELECT * FROM generated_test_cases WHERE user_id = $1 ORDER BY created_at DESC LIMIT $2 OFFSET $3`.
- **AND** returns an array of test case records respecting the pagination parameters.

#### Scenario: Full‑Text Search of Test Cases
- **WHEN** `searchTestCases(userId, keyword, limit, offset)` is called
- **THEN** the repository queries `SELECT * FROM generated_test_cases WHERE user_id = $1 AND to_tsvector('english', input || ' ' || output::text) @@ plainto_tsquery($2) ORDER BY ts_rank(to_tsvector('english', input || ' ' || output::text), plainto_tsquery($2)) DESC LIMIT $3 OFFSET $4`.
- **AND** returns matching test cases with relevance ordering.

#### Scenario: Transactional Chat Creation
- **WHEN** `createChatWithMessage(userId, title, messageContent)` is invoked
- **THEN** the repository obtains a client, begins a transaction, inserts a new chat record, inserts the initial message linked to the chat, and commits.
- **AND** if any step fails, the transaction is rolled back and an error is propagated.

#### Scenario: Centralised Error Mapping
- **WHEN** a query fails with a PostgreSQL error code (e.g., `23505` unique violation)
- **THEN** the repository throws a `DatabaseError` containing the code and detail.
- **AND** Express error‑handling middleware maps `23505` to HTTP `409 Conflict` and logs the error for debugging.
