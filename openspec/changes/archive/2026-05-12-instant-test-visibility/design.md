## Context

Currently, the `TestResults` component only renders when it receives a `stats` object from the backend after execution. Generation only returns the `script` string, leaving the results panel empty.

## Goals / Non-Goals

**Goals:**
- Update backend to extract test titles during generation.
- Initialize `testResults` state with `pending` statuses immediately after generation.
- Ensure the `TestResults` component handles tests without results/stats.

## Decisions

### 1. Generation Response Format
**Decision**: The `/api/whitebox/generate` endpoint will return a JSON object `{ script: string, testTitles: string[] }`.
**Rationale**: This allows the frontend to know exactly what tests will be run without executing them yet.
**Mechanism**: Gemini will be instructed to provide the test titles in a separate block or as part of a JSON-formatted response. Since we want reliable parsing, we'll ask Gemini to wrap the response in a JSON block or return it in a predictable format.

### 2. Frontend State Initialization
**Decision**: In `handleProcess`, if generation is successful, set `testResults` to:
```javascript
{
  stats: { total: titles.length, passed: 0, failed: 0, skipped: 0, duration: 0 },
  tests: titles.map(title => ({ title, status: 'pending', duration: 0 }))
}
```
**Rationale**: This reuses the existing `TestResults` interface while clearly indicating that tests haven't run yet.

### 3. UI Status Icon for Pending
**Decision**: Update `TestCaseItem` in `TestResults.tsx` to show a "pending" icon (e.g., a gray clock or circle) when status is 'pending'.

## Risks / Trade-offs

- **[Risk] Gemini Output Formatting** → [Mitigation] Use a strict prompt and regex to extract JSON or delimited sections from Gemini's response.
- **[Risk] State Mismatch** → [Mitigation] Ensure `handleRun` correctly overwrites or updates the specific test entries based on their titles.
