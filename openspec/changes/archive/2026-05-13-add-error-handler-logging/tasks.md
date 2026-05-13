## 1. Add Request Logger (Morgan)

- [x] 1.1 Install `morgan` as a dependency in `backend/package.json`.
- [x] 1.2 Import and wire `morgan` into `backend/src/index.js` as early middleware. Use `'dev'` format in development and `'combined'` in production. Skip logging when `NODE_ENV=test`.

## 2. Replace Global Error Handler

- [x] 2.1 Enhance `generalErrorHandler` in `backend/src/middleware/errorHandler.js` to be environment-aware: in development, return `{ error, message, stack }` in the response body; in production, return only `{ error: "Internal Server Error" }`.
- [x] 2.2 Ensure `console.error()` is called for ALL errors (including database errors) with the full stack trace and request context (method, URL).

## 3. Handle 404 Routes

- [x] 3.1 Add a 404 catch-all middleware in `backend/src/middleware/errorHandler.js` that returns `{ error: "API endpoint not found" }` with status 404.
- [x] 3.2 Wire the 404 handler in `backend/src/index.js` after all route registrations and before error handlers.

## 4. Unit & Integration Tests

- [x] 4.1 Write tests verifying that an unregistered route returns 404 with the message "API endpoint not found".
- [x] 4.2 Write tests verifying that the global error handler returns environment-appropriate responses (detail in dev, generic in prod).
- [x] 4.3 Write tests verifying that `console.error()` is called with the stack trace when an error occurs.
