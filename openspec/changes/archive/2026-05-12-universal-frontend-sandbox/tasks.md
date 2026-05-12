## 1. Backend Sandbox Implementation

- [x] 1.1 Update `POST /api/whitebox/generate` to accept `logicCode` and `uiCode`.
- [x] 1.2 Implement `generateSandboxHTML(logic, ui)` helper to create the `sandbox.html` file.
- [x] 1.3 Add logic to detect framework syntax and inject CDN scripts (Vue/React).
- [x] 1.4 Update Gemini prompt to include UI code and instructions for interaction testing.

## 2. Playwright Execution Updates

- [x] 2.1 Update the generated Playwright script to use `await page.goto('file://' + path.join(__dirname, 'sandbox.html'))`.
- [x] 2.2 Ensure the backend writes both the `.spec.js` and `sandbox.html` before running.

## 3. Frontend UI Expansion

- [x] 3.1 Modify `WhiteboxPage` to have two state variables: `logicCode` and `uiCode`.
- [x] 3.2 Update the UI layout to show two editor textareas with appropriate labels.
- [x] 3.3 Update `handleProcess` to send both code blocks to the backend.

## 4. Verification

- [x] 4.1 Test with a simple HTML button and a JS click handler.
- [x] 4.2 Test with a Vue.js snippet via CDN.
- [x] 4.3 Verify Playwright correctly clicks elements and asserts UI changes.
