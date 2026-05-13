## ADDED Requirements

### Requirement: PostgreSQL Docker Setup
The system SHALL provision a PostgreSQL 15 database via Docker Compose for local development.

#### Scenario: Start database with Docker Compose
- **WHEN** a developer runs `docker compose up -d`
- **THEN** a PostgreSQL 15 container starts on port 5435
- **AND** the database `sentra` is created automatically
- **AND** a health check verifies the database is accepting connections

#### Scenario: Persistent data storage
- **WHEN** the Docker container is stopped and restarted
- **THEN** all previously stored data SHALL be preserved via a named Docker volume (`postgres-data`)

### Requirement: Database Schema — Users Table
The system SHALL maintain a `users` table for user account data.

#### Scenario: Users table structure
- **WHEN** the migration is applied
- **THEN** the `users` table SHALL have columns: `id` (UUID, PRIMARY KEY, auto-generated), `email` (TEXT, UNIQUE, NOT NULL), `username` (TEXT, NOT NULL), `password_hash` (TEXT, NOT NULL), `created_at` (TIMESTAMPTZ, default now()), `updated_at` (TIMESTAMPTZ, default now())
- **AND** a UNIQUE index SHALL exist on `users(email)`

### Requirement: Database Schema — Generated Test Cases Table
The system SHALL maintain a `generated_test_cases` table for AI-generated test case output.

#### Scenario: Generated test cases table structure
- **WHEN** the migration is applied
- **THEN** the `generated_test_cases` table SHALL have columns: `id` (UUID, PRIMARY KEY), `user_id` (UUID, FK → users ON DELETE CASCADE), `input` (TEXT, NOT NULL), `output` (JSONB, NOT NULL), `method` (TEXT), `type` (TEXT), `created_at` (TIMESTAMPTZ, default now())
- **AND** a composite index SHALL exist on `(user_id, created_at)`
- **AND** a GIN index SHALL exist on `to_tsvector('english', input || ' ' || output::text)` for full-text search

### Requirement: Database Schema — Chats Table
The system SHALL maintain a `chats` table for chat session metadata.

#### Scenario: Chats table structure
- **WHEN** the migration is applied
- **THEN** the `chats` table SHALL have columns: `id` (UUID, PRIMARY KEY), `user_id` (UUID, FK → users ON DELETE CASCADE), `title` (TEXT), `created_at` (TIMESTAMPTZ, default now()), `updated_at` (TIMESTAMPTZ, default now())
- **AND** a composite index SHALL exist on `(user_id, updated_at)`

### Requirement: Database Schema — Messages Table
The system SHALL maintain a `messages` table for individual chat messages.

#### Scenario: Messages table structure
- **WHEN** the migration is applied
- **THEN** the `messages` table SHALL have columns: `id` (UUID, PRIMARY KEY), `chat_id` (UUID, FK → chats ON DELETE CASCADE), `user_id` (UUID, FK → users ON DELETE SET NULL), `role` (TEXT, NOT NULL — 'user' or 'assistant'), `content` (TEXT, NOT NULL), `created_at` (TIMESTAMPTZ, default now())
- **AND** a composite index SHALL exist on `(chat_id, created_at)`

### Requirement: Database Schema — Uploaded Files Table
The system SHALL maintain an `uploaded_files` table for file upload metadata.

#### Scenario: Uploaded files table structure
- **WHEN** the migration is applied
- **THEN** the `uploaded_files` table SHALL have columns: `id` (UUID, PRIMARY KEY), `user_id` (UUID, FK → users ON DELETE CASCADE), `filename` (TEXT, NOT NULL), `path` (TEXT, NOT NULL), `type` (TEXT), `size` (BIGINT), `uploaded_at` (TIMESTAMPTZ, default now())

### Requirement: Database Schema — Export History Table
The system SHALL maintain an `export_history` table for tracking test case exports.

#### Scenario: Export history table structure
- **WHEN** the migration is applied
- **THEN** the `export_history` table SHALL have columns: `id` (UUID, PRIMARY KEY), `user_id` (UUID, FK → users ON DELETE CASCADE), `format` (TEXT), `test_case_count` (INT), `file_path` (TEXT), `created_at` (TIMESTAMPTZ, default now())

### Requirement: Connection Pooling
The system SHALL use connection pooling for efficient database resource management.

#### Scenario: Pool configuration
- **WHEN** the application starts
- **THEN** a connection pool SHALL be created with max 20 connections, idle timeout of 30 seconds, and connection timeout of 5 seconds

#### Scenario: Connection retry on transient failure
- **WHEN** a database connection attempt fails due to a transient error (e.g., PostgreSQL not yet ready)
- **THEN** the system SHALL retry up to 3 times with exponential backoff (1s, 2s, 4s)
- **AND** if all retries fail, the system SHALL throw a descriptive error

#### Scenario: Graceful shutdown
- **WHEN** the application receives SIGINT or SIGTERM
- **THEN** the connection pool SHALL be drained and closed before the process exits

### Requirement: Migration Tracking
The system SHALL track which migrations have been applied to prevent re-execution.

#### Scenario: First migration run
- **WHEN** migrations are run for the first time
- **THEN** a `_migrations` tracking table SHALL be created
- **AND** all migration files SHALL be applied in alphabetical order
- **AND** each applied file SHALL be recorded in `_migrations`

#### Scenario: Subsequent migration runs
- **WHEN** migrations are run again
- **THEN** only migration files NOT already recorded in `_migrations` SHALL be applied
- **AND** previously applied migrations SHALL be skipped

### Requirement: Query Indexing Strategy
The system SHALL create database indexes to ensure query performance under load.

#### Scenario: Index creation
- **WHEN** the database schema migration is applied
- **THEN** the following indexes SHALL exist:
  - `users(email)` — UNIQUE
  - `generated_test_cases(user_id, created_at)` — composite
  - `chats(user_id, updated_at)` — composite
  - `messages(chat_id, created_at)` — composite
  - `generated_test_cases` — GIN full-text search index
- **AND** common queries (user lookup by email, test cases by user, chats by user) SHALL execute in < 100ms for tables with > 10,000 records
