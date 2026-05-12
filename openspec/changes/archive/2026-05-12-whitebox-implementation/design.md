## Context

The system requires integration of a White Box Generator, necessitating backend endpoints for LLM-based test generation and Playwright-based test execution.

## Goals / Non-Goals

**Goals:**
- Enable generation of test cases based on code input.
- Enable generation and execution of Playwright test scripts.
- Real-time reporting of test results (Pass/Fail) in the frontend.

**Non-Goals:**
- Complex test suite management.
- Multi-user collaboration.

## Decisions

- **Backend API**: Extend existing Express.js server with `/api/whitebox/generate` and `/api/whitebox/run`.
- **Playwright Execution**: Use node `child_process` to run Playwright scripts in a sandboxed environment for security.
- **LLM Integration**: Use existing infrastructure to communicate with Gemini API for test case generation.

## Risks / Trade-offs

- **Execution Safety**: Running user-provided tests is a security risk. Mitigation: Use sandboxed environment (e.g., Docker container or limited `child_process` scope).
