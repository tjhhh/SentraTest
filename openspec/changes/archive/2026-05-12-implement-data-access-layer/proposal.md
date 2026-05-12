## Why

The SentraTest application requires a robust PostgreSQL data access layer to persist user data, AI-generated test cases, chat conversations, uploaded file metadata, and export history. The existing codebase already has a partial implementation (Docker compose, migration SQL, repository.js), but it needs to be formalized—ensuring the Docker-based PostgreSQL setup is production-ready, schemas align with all spec requirements (including full-text search indexes and JSONB columns), and connection pooling is correctly configured with retry logic. This change lays the foundational persistence layer that all other backend features depend on.

## What Changes

- **PostgreSQL Docker setup**: Validate and enhance the `docker-compose.yaml` with health checks, data persistence, and environment variable consistency.
- **Database schemas**: Ensure all six tables (`users`, `generated_test_cases`, `chats`, `messages`, `uploaded_files`, `export_history`) are created with correct column types (UUID, JSONB, TEXT, TIMESTAMPTZ), constraints (UNIQUE, NOT NULL, foreign keys with CASCADE), and performance indexes.
- **Connection pooling**: Configure `pg-pool` with max 20 connections, idle timeout, connection timeout, and retry logic for transient failures.
- **Migration system**: Solidify the migration runner (`db-migrate.js`) to track applied migrations and support versioned, ordered SQL files.
- **Full-text search**: Add PostgreSQL full-text search support on `generated_test_cases` for keyword-based test case lookup.
- **Index strategy**: Create targeted indexes on `users(email)`, `generated_test_cases(user_id, created_at)`, `chats(user_id, updated_at)`, and `messages(chat_id, created_at)` for query performance under load.

## Capabilities

### New Capabilities
- `data-access`: Covers PostgreSQL Docker setup, connection pooling configuration, schema creation for all six domain tables, indexing strategy, full-text search support, and migration tooling.

### Modified Capabilities
_(none — this is the initial implementation of the data access layer)_

## Impact

- **Code**: `backend/src/data/repository.js`, `backend/scripts/db-migrate.js`, `backend/migrations/*.sql`, `docker-compose.yaml`, `backend/.env`
- **Dependencies**: `pg` (already installed), `pg-pool` (bundled with `pg`)
- **Infrastructure**: PostgreSQL 15 running in Docker on port 5435
- **APIs**: All `/api/*` routes depend on the repository layer; no API surface changes, but correct schema is a prerequisite for route handlers to function
- **Systems**: Local development environment requires Docker Desktop running for database access
