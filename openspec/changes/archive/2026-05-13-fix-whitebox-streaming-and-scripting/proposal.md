# Proposal: Fix Whitebox Execution Streaming and Script Generation

## Problem
The current whitebox testing implementation has two critical issues:
1. **Log Mismatch**: The backend returns a single JSON response instead of a stream, causing the frontend's streaming-reader to misinterpret the final JSON (and any error stacks within it) as live log steps.
2. **Invalid Input Handling**: Gemini generates Playwright scripts using `page.fill()` for non-numeric text in `<input type="number">` fields, which modern browsers reject, causing tests to fail prematurely.

## Goals
- Provide real-time feedback during test execution via streaming logs.
- Ensure generated test scripts can successfully test validation logic on numeric inputs.
- Clean up the visual timeline by preventing false step detections from error stacks.

## Proposed Changes
- **Backend Service**: Refactor `runTestScript` to accept a callback that streams stdout/stderr chunks in real-time.
- **Backend Controller**: Update the `/api/wb/run` endpoint to stream chunks to the frontend.
- **Gemini Prompt**: Update the prompt to handle `type="number"` inputs appropriately, using `page.type` or `page.pressSequentially` for testing invalid characters.
- **Frontend**: Refine the log parsing regex to be more specific to start-of-line markers.

## Risks & Mitigations
- **Stream Interruption**: Network issues could break the stream. *Mitigation*: Ensure the frontend handles stream closures gracefully and relies on the final `[RESULT: JSON]` marker for the definitive state.
- **Performance**: High-volume logging could overwhelm the UI. *Mitigation*: The current volume of Playwright logs is low enough that this shouldn't be an issue, but we will monitor it.
