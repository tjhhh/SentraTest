## 1. Backend API Verification

- [x] 1.1 Using a tool like `curl` or an API client (Postman, Insomnia), send a test `POST` request to the local `/api/bb/generate` endpoint. Verify it functions as expected and document the exact JSON structure of a successful response.

## 2. Frontend Service Implementation

- [x] 2.1 Locate the `frontend/src/services/bb.service.ts` file.
- [x] 2.2 Create and export a new async function: `generateTestCases(payload: { requirement: string; method: string; conversationId: string })`.
- [x] 2.3 Inside this function, implement the `POST` request to `/api/bb/generate`, sending the `payload` as the JSON body.
- [x] 2.4 The function should handle the response and return the data field from the API response. Add basic error handling for non-2xx responses.

## 3. Connect UI Component to Service

- [x] 3.1 In `frontend/src/app/dashboard/blackbox/page.tsx`, import `bbService`.
- [x] 3.2 In the `handleGenerate` function, remove the entire `setTimeout` block.
- [x] 3.3 Implement a `try...catch...finally` block.
- [x] 3.4 In the `try` block, call `await bbService.generateTestCases(...)` with the required state variables (`requirement`, `selectedMethod`, `activeConversation.id`).
- [x] 3.5 Process the successful response from the service. Map the `testCases` array from the response payload to the format expected by the `results` state, then call `setResults`.
- [x] 3.6 In the `catch` block, `console.error` the error and display a browser `alert()` with a user-friendly error message (e.g., "Failed to generate test cases.").
- [x] 3.7 In the `finally` block, call `setIsGenerating(false)`.

## 4. End-to-End Testing

- [x] 4.1 Run the full application stack locally.
- [x] 4.2 Test the happy path: click "Generate Test Cases" and verify that real data from the backend populates the results table.
- [x] 4.3 Test the loading state: verify the "Generating..." indicator is displayed correctly during the API call.
- [x] 4.4 Test the error path: stop the backend server and click the button to verify that the error alert is shown correctly.


## 5. Refactoring and Bug Fixes

- [x] 5.1 Consolidate redundant methods in `bb.service.ts`. Remove `generateTestCases` and ensure the main `generate` method correctly returns the data (fixing the double-unwrap bug).
- [x] 5.2 Update `BlackboxPage.tsx` to use the consolidated `generate` method and correctly handle the response payload without redundant `.data` checks.
- [x] 5.3 Verify that both generation and history loading work with the new unified data handling logic.
