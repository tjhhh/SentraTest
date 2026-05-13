## 1. Backend: Structured Generation

- [x] 1.1 Update the Gemini prompt in `backend/index.js` to return a JSON object containing both the `script` and `testTitles`.
- [x] 1.2 Update the `/api/whitebox/generate` endpoint to parse the Gemini response and return it as JSON to the frontend.
- [x] 1.3 Verify the generation API response format using a manual curl or Postman test.

## 2. Frontend: Immediate Visibility

- [x] 2.1 Update `TestResults.tsx` to include a "pending" status icon (e.g., Lucide `Circle` or `Clock`).
- [x] 2.2 Modify `handleProcess` in `WhiteboxPage.tsx` to parse `testTitles` from the response.
- [x] 2.3 Initialize the `testResults` state with the generated titles and `pending` status in `handleProcess`.
- [x] 2.4 Ensure the results panel becomes visible immediately after generation.

## 3. Frontend: Result Synchronization

- [x] 3.1 Update `handleRun` in `WhiteboxPage.tsx` to merge incoming execution results with the existing `pending` test results.
- [x] 3.2 Verify that clicking "Run Suite" correctly updates the status of the previously "pending" test cases.

## 4. Verification

- [x] 4.1 Verify end-to-step: Generate -> List of tests appears (pending) -> Run -> Statuses update to pass/fail.
- [x] 4.2 Verify that regenerating tests correctly clears and repopulates the list.
