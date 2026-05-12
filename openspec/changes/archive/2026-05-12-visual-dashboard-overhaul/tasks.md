## 1. Backend Enhancements

- [x] 1.1 Create `backend/screenshots` directory and ensure it exists on startup.
- [x] 1.2 Update `backend/index.js` to serve `screenshots` as a static directory.
- [x] 1.3 Update Gemini prompt to generate Playwright scripts with `[STEP: ...]` logging and `page.screenshot()`.
- [x] 1.4 Add logic to clean up old screenshots before a new test run.

## 2. Frontend Layout & Preview

- [x] 2.1 Refactor `WhiteboxPage` layout to a 2-column grid.
- [x] 2.2 Implement the Sandbox Preview `iframe` using `srcDoc`.
- [x] 2.3 Add styling to ensure editors and preview are well-proportioned.

## 3. Visual Timeline & Evidence

- [x] 3.1 Implement a `TestTimeline` component to parse and display structured steps.
- [x] 3.2 Implement an `EvidenceGallery` component to display captured screenshots.
- [x] 3.3 Update state management to track parsed steps and evidence URLs.

## 4. Polishing & Verification

- [x] 4.1 Improve terminal display (make it collapsible or secondary).
- [x] 4.2 Verify the end-to-end flow: Generate -> See Preview -> Run -> See Timeline -> See Screenshots.
- [x] 4.3 Add basic error state handling for failed screenshot capture.
