## Context

Currently, the whitebox generation always attempts to produce a script, even with nonsensical inputs. We want to empower Gemini to refuse generation when inputs are unrelated and ensure the frontend handles this gracefully.

## Goals / Non-Goals

**Goals:**
- Update `whitebox.service.js` prompt to include the relationship validation rule.
- Modify the backend response to include an optional `refusal` field.
- Add a visible refusal state in the frontend.

**Non-Goals:**
- Implementing a sophisticated static analysis tool for relationship validation (we rely on Gemini).
- Changing the test execution engine itself.

## Decisions

### 1. Data Contract Update
**Decision**: Add an optional `refusal` string field to the JSON returned by Gemini and the backend API.
**Rationale**: This is the cleanest way to signal a "soft failure" (validation failure) without triggering a HTTP error state which usually implies a system/server issue.

### 2. Backend Logic
**Decision**: If `refusal` is present in the AI response, the backend will skip file writing (sandbox/temp-test) and return the refusal immediately.
**Rationale**: Saves disk I/O and prevents the runner from trying to execute a non-existent or empty script.

### 3. Frontend Refusal UI
**Decision**: Use a Lucide `AlertCircle` icon and a yellow/amber background alert box in the Results area.
**Rationale**: Clearly distinguishes validation refusal from a technical error (red) or a successful run (green).

## Risks / Trade-offs

- **[Risk] Gemini hallucinating relationship** → Mitigation: Keep the prompt strict and ask Gemini to provide specific reasons for refusal.
- **[Risk] Frontend crash if `refusal` is null** → Mitigation: Use optional chaining and default values in React state.
