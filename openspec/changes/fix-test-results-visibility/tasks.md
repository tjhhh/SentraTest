## 1. Frontend: State Persistence

- [ ] 1.1 In `WhiteboxPage.tsx`, remove the `setTestResults(null)` call at the beginning of `handleRun`.
- [ ] 1.2 Implement a state update in `handleRun` that maps all current `testResults.tests` to `status: 'pending'` to indicate a fresh run while maintaining visibility.

## 2. Frontend: Robust Stream Reader

- [ ] 2.1 Implement a `lineBuffer` variable in `handleRun` to accumulate stream chunks.
- [ ] 2.2 Update the `while` loop to append chunks to `lineBuffer` and process only complete lines (split by `\n`).
- [ ] 2.3 Ensure the remaining fragment in `lineBuffer` is preserved for the next iteration.
- [ ] 2.4 Update regex matching to use the complete lines from the buffer.

## 3. Verification

- [ ] 3.1 Verify that the test list remains visible immediately after clicking "Run Suite".
- [ ] 3.2 Verify that the list icons pulse (pending) during execution.
- [ ] 3.3 Verify that the final results are correctly parsed and updated in the UI.
