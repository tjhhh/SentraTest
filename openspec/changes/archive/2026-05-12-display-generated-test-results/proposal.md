## Why

Currently, when a user runs a generated test suite, they only see raw terminal logs and a visual timeline of steps. There is no clear, aggregated summary of the test results (e.g., "5 tests passed, 0 failed") or a detailed breakdown of each generated test case's outcome. This makes it difficult for users to quickly assess the health of their code based on the generated tests.

## What Changes

- **Test Summary Card**: A high-level dashboard showing total tests, passes, failures, and execution time.
- **Detailed Test Case List**: An interactive list of all executed test cases with status indicators, execution time, and expandable error details.
- **Result-to-Timeline Linking**: Clicking a test result will focus the visual timeline and evidence gallery on that specific test case.
- **Structured Result Extraction**: Backend will now configure Playwright to output results in JSON format, which will be parsed and streamed/sent to the frontend.

## Capabilities

### New Capabilities
- `test-result-visualization`: Handles the display and interactivity of test suite outcomes in the frontend.
- `test-report-parser`: Backend capability to transform raw test runner outputs into structured result objects.

### Modified Capabilities
- `test-execution-engine`: Updated to support JSON reporting and artifact collection for individual test cases.
- `visual-test-timeline`: Updated to allow filtering or highlighting based on specific test case results.

## Impact

- **Backend**: Update `POST /api/whitebox/run` to handle Playwright JSON reporter flags and read the output file.
- **Frontend**: New components in `frontend/src/components/` and state updates in the Whitebox page.
- **API**: Addition of a structured `results` object in the execution response/stream.
