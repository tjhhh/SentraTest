## Why

The current whitebox functionality is entirely mocked in the frontend, and the backend lacks any implementation. To provide value, we need a functional system that can actually analyze code, generate Playwright scripts, and execute them remotely.

## What Changes

- **Backend Implementation**: Create a functional Express server with endpoints for test generation and execution.
- **Frontend Logic Fix**: Replace mock logic with real API calls to the backend.
- **Gemini API Integration**: Integrate Gemini API to generate intelligent test scenarios and Playwright scripts based on source code analysis.
- **Playwright Execution Engine**: Implement a mechanism in the backend to safely execute generated Playwright scripts and stream logs/results back to the frontend.

## Capabilities

### New Capabilities
- `test-execution-engine`: Ability to remotely execute Playwright scripts in an isolated environment and capture output.
- `whitebox-generator`: Ability to analyze JavaScript/Node.js code and generate Playwright test cases based on coverage criteria.

### Modified Capabilities
- `whitebox`: Update requirements if necessary to align with implementation constraints (though existing spec seems accurate).

## Impact

- **Backend**: New dependencies (google-generative-ai, playwright). New `index.js` file.
- **Frontend**: `WhiteboxPage` component will be updated to use real API calls.
- **DevOps**: Docker configuration might need updates to include Playwright dependencies in the backend container.
