## Why

Currently, test cases are only visible after they have been executed. Users have to wait for the full test run to complete before they can even see what tests were generated. This creates a "black box" experience during the generation phase. Displaying the test cases immediately after generation provides instant feedback and allows users to see the scope of testing before execution.

## What Changes

- **Structured Generation Response**: Update the Gemini prompt and backend logic to return both the generated script and a list of test case titles.
- **Immediate Result Initialization**: The frontend will populate the `TestResults` component with "pending" test cases as soon as the generation is successful.
- **Visual Feedback for Generation**: The UI will show the expected test outcomes (without results yet) immediately after "Generate Tests".

## Capabilities

### Modified Capabilities
- `whitebox-generator`: Updated to return structured metadata (test titles) alongside the code.
- `test-result-visualization`: Updated to support an "initial/pending" state for test cases before they are run.

## Impact

- **Backend**: Update `POST /api/whitebox/generate` prompt and response parsing.
- **Frontend**: Update `WhiteboxPage.tsx` to handle the new generation response and initialize `testResults`.
- **API**: Change `POST /api/whitebox/generate` response format from `{ script: string }` to `{ script: string, testTitles: string[] }`.
