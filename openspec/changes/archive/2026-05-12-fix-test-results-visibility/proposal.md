## Why

Currently, when a user clicks "Run Suite", the list of generated test cases disappears because the state is immediately reset to `null`. Additionally, the final JSON result payload can be fragmented across multiple network chunks, causing parsing errors and preventing the results from ever appearing. This makes the UI feel broken during and after the test run.

## What Changes

- **Persistent Test List**: Modify the frontend to keep the generated test list visible while the test is running.
- **Run-State Reset**: Instead of clearing the list, clicking "Run Suite" will reset the status of all existing test cases back to "pending".
- **Robust Stream Parsing**: Implement a buffer-based stream reader to correctly handle fragmented chunks, ensuring the full `[RESULT: JSON]` payload is captured even if split across packets.

## Capabilities

### Modified Capabilities
- `test-result-visualization`: Updated to require state persistence and "in-progress" visual feedback during execution.
- `test-execution-engine`: Updated to specify robust handling of fragmented result markers in the response stream.

## Impact

- **Frontend**: Update `handleRun` logic in `WhiteboxPage.tsx` and improve the line-by-line parsing strategy.
- **Reliability**: Eliminates the "vanishing results" bug and improves compatibility with slower or unstable network streams.
