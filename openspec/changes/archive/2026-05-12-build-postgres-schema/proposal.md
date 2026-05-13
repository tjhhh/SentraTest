## Why

The application currently lacks a structured, version‑controlled data store for user interactions, test case generation, and file exports. Adding a PostgreSQL database provides reliable persistence, relational integrity, and powerful querying capabilities, enabling new features such as chat history, test case tracking, and export audits.

## What Changes

- Introduce a Docker‑based PostgreSQL instance.
- Define a comprehensive database schema with tables: `users`, `chats`, `messages`, `generated_test_cases`, `uploaded_files`, `export_history`.
- Add indexes and foreign‑key constraints for data integrity and query performance.
- Provide `JSONB` columns where flexible data structures are needed.
- Create migration scripts (SQL) to set up and evolve the schema.
- Implement an Express.js service layer using the `pg` driver to interact with the database.

## Capabilities

### New Capabilities
- `postgres-schema`: Establishes the relational data model and migration workflow.
- `data-access-layer`: Express.js + pg integration for CRUD operations on the new tables.
- `docker-postgres`: Docker configuration to run PostgreSQL locally for development and CI.

### Modified Capabilities
- *(none)*

## Impact

- Adds a new Docker service (`postgres`) to the development environment.
- Introduces a new Node.js dependency (`pg`) and related configuration files.
- Requires updates to existing services that previously used in‑memory or file‑based storage.
- Migration scripts will be executed during application startup or via a CLI command.
