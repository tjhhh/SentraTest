# Proposal: Fix Whitebox Screenshot Visibility

## Problem
Screenshots generated during whitebox tests are not appearing in the frontend because:
1. **Path Mismatch**: The backend `app.js` serves from `src/screenshots`, but the whitebox module saves to `src/modules/whitebox/screenshots`.
2. **Missing Log Marker**: The frontend expects a `[EVIDENCE: SCREENSHOTS] file1.png,file2.png` line in the stream to populate the gallery, which the backend is not sending.
3. **Inconsistent URLs**: Frontend components use different fallback ports (`5000`, `5001`) for the API URL, leading to broken image links when `NEXT_PUBLIC_API_URL` is not set.

## Goals
- Ensure screenshots are saved to a directory that is publicly served.
- Provide the frontend with real-time (or end-of-run) notification of captured screenshots.
- Standardize backend communication across all frontend components.

## Proposed Changes
- **Backend Controller**: Change `screenshotsDir` to point to the shared `src/screenshots` directory.
- **Backend Controller**: Send the `[EVIDENCE: SCREENSHOTS]` log marker before the final JSON result.
- **Backend Service**: Update the Gemini prompt to tell the test script to save screenshots to the shared directory.
- **Frontend Components**: Standardize the fallback API URL to `http://localhost:4000`.
- **Frontend Page**: Update `handleRun` to also extract screenshots from the final `[RESULT: JSON]` as a backup.

## Risks & Mitigations
- **Overwriting**: Concurrent tests might overwrite screenshots. *Mitigation*: The current implementation uses `Date.now()` in filenames, which is sufficient for single-user/sandbox environments.
