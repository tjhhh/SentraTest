## Why

The current system lacks the backend-to-frontend integration required for the White Box Generator to function. This implementation is necessary to fulfill the core requirements of generating test cases and executing them using Playwright.

## What Changes

- Create backend endpoints for handling code analysis (via LLM) and test execution (via Playwright).
- Create frontend interfaces for code input, coverage selection, and execution results.
- Implement Playwright execution engine in the backend.

## Capabilities

### New Capabilities
- `whitebox-generator`: Enables code analysis and test case generation for white box testing.
- `test-execution-engine`: Enables execution of Playwright tests and reporting of results.

### Modified Capabilities
- None.

## Impact

- Frontend: New UI components in `src/app/(dashboard)/whitebox`.
- Backend: New API routes and Playwright execution utilities.
