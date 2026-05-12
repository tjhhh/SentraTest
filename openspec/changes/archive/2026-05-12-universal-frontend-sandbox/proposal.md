## Why

Users need to test visual interactions and UI components, not just pure logic. Currently, the system only supports JavaScript logic testing. This change introduces a "Universal Sandbox" where users can paste both logic and UI code to perform end-to-end component testing.

## What Changes

- **Frontend Multi-Input**: Split the editor into two sections: Logic (JS) and UI (HTML/Framework snippets).
- **Backend Sandbox Renderer**: Create a mechanism to inject logic and UI into a standalone HTML file.
- **Enhanced Gemini Prompt**: Update Gemini to generate Playwright scripts that interact with the rendered UI elements.
- **Framework Agnostic Support**: Support basic HTML/JS by default and provide hooks for CDN-based framework support (Vue, React via CDN).

## Capabilities

### New Capabilities
- `ui-interaction-testing`: Ability to perform visual assertions and interactions (click, type) on user-provided UI snippets.
- `universal-sandbox-renderer`: Ability to generate a valid HTML environment from disparate logic and UI fragments.

### Modified Capabilities
- `whitebox-generator`: Update to handle dual-input (logic + UI) for script generation.

## Impact

- **Frontend**: Significant UI update to `WhiteboxPage` to accommodate two editors.
- **Backend**: Update to `POST /api/whitebox/generate` and new internal logic for HTML generation.
- **DevOps**: No significant changes.
