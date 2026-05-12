## Context

The current implementation of `handleRun` clears the `testResults` state immediately, causing the UI list of generated tests to disappear. Furthermore, the streaming logic in the frontend relies on `chunk.split('\n')`, which is unsafe because a network chunk might arrive in the middle of a line (e.g., half of a JSON string), leading to failed regex matches or `JSON.parse` errors.

## Goals / Non-Goals

**Goals:**
- Maintain visibility of the test list during execution.
- Ensure reliable parsing of the final JSON result payload regardless of chunk fragmentation.
- Provide clear visual feedback that tests are "In Progress" when "Run Suite" is clicked.

## Decisions

### 1. State Preservation
**Decision**: In `handleRun`, replace `setTestResults(null)` with a mapping function that resets the `status` of all existing tests to `pending`.
**Rationale**: This keeps the results panel visible and correctly reflects the current state of the execution engine (re-running).

### 2. Stream Buffer Implementation
**Decision**: Use a local `lineBuffer` string within `handleRun`.
**Rationale**: 
1. Append each new `decoder.decode(value)` to `lineBuffer`.
2. Split `lineBuffer` by `\n`.
3. Process all complete lines (all elements except the last one).
4. Keep the last element (the incomplete line) in the `lineBuffer` for the next chunk.
**Benefit**: This guarantees that `line.match()` and `JSON.parse()` are always performed on complete, valid lines.

### 3. Regex Robustness
**Decision**: Ensure the `[RESULT: JSON]` regex can handle potentially large payloads.
**Rationale**: The JSON object contains all test results and stats; ensuring it is parsed from a complete line is critical for UI consistency.

## Risks / Trade-offs

- **[Risk] Memory Leak in Buffer** → [Mitigation] The buffer is local to the `handleRun` call and will be garbage collected after the stream ends.
- **[Risk] Large Output Volumes** → [Mitigation] Since we only care about specific markers for state updates, the processing overhead of the buffer is negligible.
