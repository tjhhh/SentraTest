# Design: Whitebox Result Parsing Fix

## Frontend Data Extraction
The current parsing logic in `WhiteboxPage.tsx` takes the entire JSON object from the `[RESULT: JSON]` marker:

```javascript
// Current (Buggy)
const data = JSON.parse(resultMatch[1]);
setTestResults(data); 

// Fixed
const data = JSON.parse(resultMatch[1]);
if (data.data && data.data.results) {
  setTestResults(data.data.results);
}
```

## Type Safety
We will ensure that the extracted data matches the `testResults` state type:
`{ stats: TestStats; tests: TestResult[] }`

## Validation Plan
1. Trigger a whitebox test run.
2. Verify that the `TestResults` component renders correctly once the `[RESULT: JSON]` marker is received.
3. Verify that the "total", "passed", "failed", and "time" stats are correctly displayed.
