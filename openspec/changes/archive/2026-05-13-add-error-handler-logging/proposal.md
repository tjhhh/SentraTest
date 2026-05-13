## Why

The backend currently has a minimal error handler (`generalErrorHandler`) that logs errors to console but does not differentiate between development and production environments, does not handle 404 routes, and has no request logging. This makes debugging difficult — errors can go unnoticed, there is no traceability for incoming requests, and unregistered routes return confusing default responses instead of a clear 404.

## What Changes

- Install `morgan` for HTTP request logging and wire it into the Express middleware stack.
- Replace the current `generalErrorHandler` with a comprehensive global error handler that:
  - Prints full stack traces via `console.error()` for all errors (including database errors).
  - Returns environment-aware responses (detailed in development, generic in production).
  - Handles validation errors (400) with structured error arrays.
- Add a 404 catch-all route handler after all registered routes but before the error middleware.
- Write unit tests for the new error handler and 404 middleware.

## Capabilities

### New Capabilities

### Modified Capabilities
- `system`: Adding detailed error handling scenarios (environment-aware responses, 404 handling) and request logging requirement.

## Impact

- **Affected Code**: `backend/src/index.js`, `backend/src/middleware/errorHandler.js`
- **Dependencies**: New npm dependency `morgan`.
- **APIs**: All API endpoints gain consistent error response format. Unregistered routes now return a structured 404 JSON response.
