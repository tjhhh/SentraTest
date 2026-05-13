## 1. Setup Docker PostgreSQL Service

- [x] 1.1 Add `postgres` service to `docker-compose.yml` with image `postgres:15`, env vars for `POSTGRES_USER`, `POSTGRES_PASSWORD`, `POSTGRES_DB`, and a persisted volume `postgres-data`.
- [x] 1.2 Verify Docker container starts and is reachable on `localhost:5432`.

## 2. Create Migration Scripts

- [x] 2.1 Write `migrations/001_create_schema.sql` containing `CREATE TABLE` statements for `users`, `chats`, `messages`, `generated_test_cases`, `uploaded_files`, and `export_history` with primary keys, foreign keys, indexes, and JSONB columns as defined in the spec.
- [x] 2.2 Add a simple Node.js CLI script `scripts/db-migrate.js` that executes the migration SQL against the Docker PostgreSQL instance using the `pg` driver.
- [x] 2.3 Ensure the migration script is idempotent (use `CREATE TABLE IF NOT EXISTS` and `DROP INDEX IF EXISTS`).

## 3. Implement Data Access Layer (pg)

- [x] 3.1 Create a new module `src/data/db.js` that initialises a `Pool` from the `pg` package using environment variables.
- [x] 3.2 Implement helper functions for each table (e.g., `createUser`, `getUserById`, `createChat`, `addMessage`, `listMessagesByChat`, `storeGeneratedTestCase`, `recordUpload`, `logExport`). Use parameterised queries.
- [x] 3.3 Add transaction support for operations that span multiple tables (e.g., creating a chat with initial message).

## 4. Add Environment Configuration

- [x] 4.1 Extend `.env.example` with `PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`.
- [x] 4.2 Load these variables in the application start‑up (using `dotenv`).

## 5. Integrate with Express Routes

- [x] 5.1 Update route handlers (or create new ones) to use the data‑access functions for CRUD operations on users, chats, messages, test cases, uploaded files, and export history.
- [x] 5.2 Ensure proper error handling and return appropriate HTTP status codes.
- [x] 5.3 Add validation middleware for request bodies (e.g., using `express-validator`).

## 6. Write Tests

- [x] 6.1 Add unit tests for each data‑access helper using a test PostgreSQL container (via `testcontainers` or a dedicated test DB).
- [x] 6.2 Write integration tests for the Express endpoints that verify DB interactions.

## 7. Documentation & OpenAPI

- [x] 7.1 Extend the OpenAPI spec (`api/docs/openapi.yaml`) to include new endpoints for the added resources.
- [x] 7.2 Update README with instructions on running Docker PostgreSQL, applying migrations, and environment setup.
