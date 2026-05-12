## 1. Backend Enhancements

- [ ] 1.1 Create `backend/screenshots` directory and ensure it exists on startup.
- [ ] 1.2 Update `backend/index.js` to serve `screenshots` as a static directory.
- [ ] 1.3 Update Gemini prompt to generate Playwright scripts with `[STEP: ...]` logging and `page.screenshot()`.
- [ ] 1.4 Add logic to clean up old screenshots before a new test run.

## 2. Frontend Layout & Preview

- [ ] 2.1 Refactor `WhiteboxPage` layout to a 2-column grid.
- [ ] 2.2 Implement the Sandbox Preview `iframe` using `srcDoc`.
- [ ] 2.3 Add styling to ensure editors and preview are well-proportioned.

## 3. Visual Timeline & Evidence

- [ ] 3.1 Implement a `TestTimeline` component to parse and display structured steps.
- [ ] 3.2 Implement an `EvidenceGallery` component to display captured screenshots.
- [ ] 3.3 Update state management to track parsed steps and evidence URLs.

## 4. Polishing & Verification

- [ ] 4.1 Improve terminal display (make it collapsible or secondary).
- [ ] 4.2 Verify the end-to-end flow: Generate -> See Preview -> Run -> See Timeline -> See Screenshots.
- [ ] 4.3 Add basic error state handling for failed screenshot capture.
