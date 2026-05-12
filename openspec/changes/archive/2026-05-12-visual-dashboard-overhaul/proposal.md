## Why

The current terminal-only output lacks visual transparency and fails to build user trust in the automated testing process. To make the platform more professional and useful, we need a visual dashboard that provides real-time UI feedback, structured test steps, and visual evidence (screenshots) of test execution.

## What Changes

- **Dashboard Layout Overhaul**: Redesign the `WhiteboxPage` with a 2-column layout (Editors on left, Preview/Results on right).
- **Real-time Sandbox Preview**: Add a live `iframe` to preview user-provided UI snippets instantly.
- **Visual Interaction Timeline**: Replace raw terminal logs with a structured, step-by-step visual progress list.
- **Screenshot Evidence Integration**: Capture and display screenshots from Playwright execution in the frontend.
- **Backend Static Serving**: Update backend to serve captured screenshots.

## Capabilities

### New Capabilities
- `visual-test-timeline`: Ability to display structured test steps with success/fail indicators in the UI.
- `screenshot-evidence-service`: Ability to capture, store, and serve screenshots from Playwright test runs.
- `live-sandbox-preview`: Real-time rendering of user UI code in an isolated iframe.

### Modified Capabilities
- `test-execution-engine`: Update to support screenshot capture and structured logging.

## Impact

- **Frontend**: Major refactoring of `WhiteboxPage.tsx`. New components for Timeline and Screenshot display.
- **Backend**: Update `index.js` to include screenshot capture in Gemini prompts and serve static files. New `/screenshots` directory.
- **DevOps**: Ensure the backend container can write and serve files from the screenshots directory.
