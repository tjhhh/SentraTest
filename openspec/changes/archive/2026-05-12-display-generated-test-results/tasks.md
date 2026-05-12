## 1. Backend Implementation

- [x] 1.1 Update `backend/index.js` execution logic to include `--reporter=json --reporter=list` and specify the output file path.
- [x] 1.2 Implement a `parsePlaywrightJson` utility to extract summary stats and individual test outcomes from the JSON report.
- [x] 1.3 Update the `POST /api/whitebox/run` endpoint to read the report file after process exit and emit a `RESULT` event via SSE or as a final response chunk.
- [x] 1.4 Ensure the temporary `results.json` file is cleaned up before and after each run.

## 2. Frontend Components

- [x] 2.1 Create `TestResults.tsx` component to display the overall pass/fail summary and execution time.
- [x] 2.2 Implement a `TestCaseItem` component to show individual test names, status icons, and duration.
- [x] 2.3 Implement an "Error Detail" view for failed tests, including formatted stack traces.
- [x] 2.4 Add basic styling to ensure the results fit well within the existing dashboard layout.

## 3. Integration & Interactivity

- [x] 3.1 Update state management in `WhiteboxPage.tsx` to store and display `testResults`.
- [x] 3.2 Update the stream handler to detect the structured result payload and update the state.
- [x] 3.3 Implement the `onSelectTestCase` callback to highlight the corresponding steps in the `TestTimeline`.
- [x] 3.4 Ensure the UI correctly clears old results when a new test run is started.

## 4. Verification

- [x] 4.1 Verify that a successful test run displays a green summary and pass status for all cases.
- [x] 4.2 Verify that a failing test run (e.g., assertion failure) displays a red summary and shows the error message in the list.
- [x] 4.3 Verify that clicking a test case result correctly filters or navigates the visual timeline.
