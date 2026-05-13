## Context

The backend (`backend/src/index.js`) currently uses two error-handling middlewares from `middleware/errorHandler.js`: `dbErrorHandler` (maps PostgreSQL error codes to HTTP statuses) and `generalErrorHandler` (catches all remaining errors). Neither distinguishes between `NODE_ENV=development` and `NODE_ENV=production`, and there is no request logging or 404 handler. The spec at `openspec/specs/system/spec.md` mandates environment-aware error responses, 404 handling, and HTTP request logging.

## Goals / Non-Goals

**Goals:**
- Add `morgan` request logging as early middleware in `index.js`.
- Enhance `generalErrorHandler` to be environment-aware: return stack traces in development, generic messages in production.
- Add a 404 catch-all middleware after all routes and before error handlers.
- Ensure all errors (including database errors) print full details to `console.error()`.

**Non-Goals:**
- Replacing the existing `dbErrorHandler` logic (it already works correctly for PostgreSQL error mapping).
- Adding structured logging (e.g., Winston, Pino) — `morgan` + `console.error` is sufficient for this scope.
- Frontend error handling changes.

## Decisions

- **Morgan format**: Use `'dev'` format in development (concise colored output) and `'combined'` in production (Apache-style). Rationale: `'dev'` is readable during local development; `'combined'` is machine-parseable for production log aggregation.
- **404 placement**: The 404 catch-all will be placed after all route registrations and before `dbErrorHandler`/`generalErrorHandler`. Rationale: Express processes middleware in order; this position ensures only truly unmatched routes trigger the 404.
- **Preserve existing `dbErrorHandler`**: Keep it as-is since it already correctly maps PostgreSQL error codes. The `generalErrorHandler` enhancement will serve as the final fallback.

## Risks / Trade-offs

- [Risk] `morgan` logs every request to stdout which could be noisy in test runs. → Mitigation: Conditionally skip morgan when `NODE_ENV=test`.
