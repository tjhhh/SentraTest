# Design: Whitebox Streaming & Scripting Improvements

## Backend Streaming Architecture
The backend will use the `Transfer-Encoding: chunked` header to keep the connection open while Playwright runs.

### Log Format
Logs will be sent line-by-line:
1. Standard Playwright output (e.g., `Running 1 test...`)
2. Custom step markers (e.g., `[STEP: CLICK] ...`)
3. Final result marker: `[RESULT: JSON] {"stats": ..., "tests": ...}`

### Internal Service Change
`whitebox.service.js` -> `runTestScript(onDataCallback)`
The `spawn` child process will trigger `onDataCallback(data)` whenever `stdout` or `stderr` emits.

## Script Generation (Gemini Prompt)
The prompt in `whitebox.service.js` will be updated with:
- "When interacting with `<input type="number">`, use `page.fill` for valid numbers."
- "If testing invalid non-numeric input for validation coverage, use `page.type` instead of `page.fill` to bypass browser-level blocks if necessary, or acknowledge that the browser might prevent the input."
- "Ensure all `[STEP: ...]` logs are on their own line."

## Frontend Parsing Refinement
The frontend's `handleRun` already has a streaming loop. We will ensure the backend actually provides the stream. We'll also update the regex to `^\[STEP: (.*?)\] (.*)` (adding anchor) if possible, although the current `match` is usually sufficient once the stream is clean.
