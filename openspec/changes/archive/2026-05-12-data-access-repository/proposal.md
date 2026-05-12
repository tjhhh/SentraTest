## Why

The current codebase lacks a robust data‑access layer that provides safe, reusable, and performant interactions with PostgreSQL. Without connection pooling, parameterised queries, pagination, full‑text search and proper transaction handling, the application risks SQL injection, performance bottlenecks, and inconsistent data.

## What Changes

- Add a repository module built on `pg-pool` with connection pooling.
- Implement parameterised CRUD queries for all domain tables.
- Provide pagination helpers for list endpoints.
- Implement full‑text search for test case data.
- Add transaction support for multi‑step operations.
- Centralised error handling that maps database errors to HTTP responses.
- Expose the repository through Express.js route handlers.

## Capabilities

### New Capabilities
- `data-access-repository`: A clean, testable repository layer using `pg-pool` that offers the features listed above.

### Modified Capabilities
- *(none)*

## Impact

- Introduces a new dependency `pg-pool` (included in `pg`).
- Adds new source files under `src/data/`.
- Requires environment variables for PostgreSQL connection.
- Existing route handlers will be updated to use the repository instead of ad‑hoc queries.
