## Context

The system currently generates and executes Playwright tests, streaming stdout to a terminal and parsing custom `[STEP: ...]` logs to build a visual timeline. However, the overall "Pass/Fail" status of the test suite and individual test cases is not explicitly captured in a structured format for the UI.

## Goals / Non-Goals

**Goals:**
- Extract structured test outcomes (Pass/Fail/Skip, duration, errors) from Playwright.
- Implement a dashboard-style summary for the test run.
- Implement a detailed list of test cases with rich error reporting.
- Synchronize the "Test Results" view with the "Visual Timeline" and "Evidence Gallery".

**Non-Goals:**
- Real-time result updates *while* the test is running (results will be shown upon completion).
- Integration with external CI/CD reporting tools (this is for the local dev/test experience).
- Historical tracking of past test runs (focus is on the current session).

## Decisions

### 1. Playwright JSON Reporter
**Decision**: Use the built-in Playwright JSON reporter by adding `--reporter=json` to the execution command.
**Rationale**: It provides a standardized, comprehensive schema for test outcomes, including execution time, errors, and location, without requiring custom parsing of the stdout stream.
**Alternative**: Custom stdout parsing for "ok" or "failed" markers. (Rejected as it's fragile and less rich).

### 2. Backend Processing
**Decision**: The backend will write the JSON report to a temporary file (e.g., `test-results.json`), read it once the process exits, and send the parsed object to the frontend in a final `RESULT` message.
**Rationale**: Reading from a file after exit is robust. Streaming JSON increments is complex and unnecessary for our current scale.

### 3. Frontend Component: `TestResults`
**Decision**: Create a new `TestResults.tsx` component using a "Summary + Details" layout.
**Rationale**: Users need to see the "big picture" first, then dive into specific failures.
**State Sync**: The component will use an `onSelectTestCase` callback to update the active step in the `TestTimeline`.

## Risks / Trade-offs

- **[Risk] File Cleanup** → [Mitigation] Ensure the temporary JSON report is deleted or overwritten before each run.
- **[Risk] Large Error Logs** → [Mitigation] The `TestReportParser` should truncate or summarize extremely long stack traces for UI performance.
- **[Risk] Process Interruption** → [Mitigation] If the test runner crashes or is stopped, the backend should send a partial or "Error" result object.
