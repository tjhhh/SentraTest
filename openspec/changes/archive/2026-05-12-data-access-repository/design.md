## Context

The application currently interacts with PostgreSQL using ad‑hoc queries scattered throughout route handlers. This leads to duplicated code, lack of connection pooling, missing transaction boundaries, and no unified error handling. The existing `data-access/Spec.md` defines the required domain operations (user management, test case handling, chat/message storage, file uploads, export logging) but does not prescribe an implementation strategy.

## Goals / Non-Goals

**Goals:**
- Provide a single repository module (`src/data/repository.js`) that encapsulates all database interactions.
- Use `pg`'s built‑in `Pool` (pg‑pool) for efficient connection reuse.
- Expose only parameterised queries to prevent SQL injection.
- Implement pagination helpers for list endpoints (users, chats, messages, test cases, uploaded files, export history).
- Add full‑text search capability for test case `input` and `output` JSONB fields using PostgreSQL `to_tsvector` and GIN indexes.
- Supply transaction utilities to group multi‑step operations (e.g., create chat + initial message).
- Centralise error handling: map database errors to HTTP status codes and log context for debugging.

**Non-Goals:**
- Introduce a full‑featured ORM (e.g., Sequelize, TypeORM). The design intentionally uses raw queries for performance and fine‑grained control.
- Provide a UI for database administration.
- Migrate existing legacy data (there is none yet).

## Decisions

1. **Connection Pooling** – Use `pg.Pool` with configuration from environment variables (`PGHOST`, `PGPORT`, `PGUSER`, `PGPASSWORD`, `PGDATABASE`). Max pool size set to 20 connections, matching the performance requirement in the spec.
2. **Query Layer** – All repository functions will be async and return Promises. Queries are written as parameterised SQL strings (`$1`, `$2`, …) and executed via `pool.query`.
3. **Pagination** – Helper `paginate(query, {limit, offset})` will inject `LIMIT $n OFFSET $n+1` clause. Default limit 20, client‑controlled via query params.
4. **Full‑Text Search** – Create a GIN index on `generated_test_cases` using `to_tsvector('english', input || ' ' || output::text)`. Search function will use `@@ plainto_tsquery($1)`.
5. **Transaction Support** – Export a `withTransaction(callback)` utility that obtains a client from the pool, begins a transaction, executes the callback, and commits or rolls back on error.
6. **Error Handling** – Define a `DatabaseError` class that captures `code`, `detail`, and `constraint`. Middleware will translate known `code`s (e.g., `23505` unique violation) to `409 Conflict`, others to `500 Internal Server Error`.
7. **Testing Strategy** – Use `testcontainers` to spin up a PostgreSQL container for unit tests, ensuring the repository is exercised against a real DB.

## Risks / Trade-offs

- **Risk:** Direct SQL increases boilerplate and risk of mismatched schema. *Mitigation:* Centralise all queries in the repository and generate TypeScript typings from the schema (optional future work).
- **Risk:** Manual migration management could cause drift. *Mitigation:* Keep migration scripts version‑controlled and executed via a simple CLI (`npm run db:migrate`). Future iteration may adopt a migration framework.
- **Trade‑off:** Skipping an ORM reduces abstraction overhead but requires careful query composition and testing.
- **Risk:** Full‑text search relevance tuning may be needed. *Mitigation:* Start with `plainto_tsquery` and adjust weighting later based on user feedback.
