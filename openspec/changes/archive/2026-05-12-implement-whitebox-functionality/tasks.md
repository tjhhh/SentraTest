## 1. Backend Setup

- [x] 1.1 Install backend dependencies: `cors`, `dotenv`, `express`, `@google/generative-ai`, `@playwright/test`.
- [x] 1.2 Create `backend/index.js` with basic Express setup and CORS.
- [x] 1.3 Update `backend/Dockerfile` to include Playwright dependencies and browsers.

## 2. Whitebox API Implementation

- [x] 2.1 Implement `POST /api/whitebox/generate` endpoint.
- [x] 2.2 Create Gemini prompt template for code analysis and Playwright script generation.
- [x] 2.3 Implement logic to write generated script to a temporary file.
- [x] 2.4 Implement `POST /api/whitebox/run` endpoint using `child_process.spawn`.
- [x] 2.5 Add error handling for script generation and execution.

## 3. Frontend Integration

- [x] 3.1 Update `handleProcess` in `frontend/src/app/(dashboard)/whitebox/page.tsx` to call `/api/whitebox/generate`.
- [x] 3.2 Update `handleRun` in `frontend/src/app/(dashboard)/whitebox/page.tsx` to call `/api/whitebox/run`.
- [x] 3.3 Ensure terminal output correctly displays streamed logs from the backend.

## 4. Verification

- [x] 4.1 Test generation with various JavaScript snippets.
- [x] 4.2 Verify script execution shows real Playwright output in the terminal.
- [x] 4.3 Verify coverage settings (Statement, Branch, Path) affect the prompt sent to Gemini.
