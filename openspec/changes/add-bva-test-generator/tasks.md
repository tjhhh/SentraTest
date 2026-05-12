## 1. Setup & Dependencies

- [x] 1.1 Add required npm packages to backend (gemini-pro-client, papaparse, pdfkit)
- [x] 1.2 Add required npm packages to frontend (lucide-react for icons if needed)
- [x] 1.3 Setup Gemini API credentials and environment variables (.env.local for backend)
- [x] 1.4 Create database migration for `bva_test_cases` table with columns: id (UUID), requirement_text, test_cases (JSON), created_at, user_id
- [x] 1.5 Verify database migration runs successfully

## 2. Backend - Database & Models

- [x] 2.1 Create TypeScript interface/model for TestCase with fields: id, name, input, expectedOutput, boundaryType, category
- [x] 2.2 Create TypeScript interface/model for BVAGenerationRequest and BVAGenerationResponse
- [x] 2.3 Create Prisma schema (or equivalent) for bva_test_cases table
- [x] 2.4 Create repository/service function to save test cases to database: `saveBVATestCases(userId, requirementText, testCases)`
- [x] 2.5 Create repository/service function to retrieve test case history: `getBVAHistory(userId, limit?)`

## 3. Backend - Gemini API Integration

- [x] 3.1 Create Gemini API client service with method `analyzeBoundaryValues(requirementText): Promise<TestCase[]>`
- [x] 3.2 Design and implement system prompt for Gemini that instructs it to analyze BVA boundaries and return structured JSON
- [x] 3.3 Implement JSON parsing and validation from Gemini response
- [x] 3.4 Add error handling for Gemini API (rate limiting, invalid responses, timeouts)
- [x] 3.5 Implement retry logic with exponential backoff (max 3 retries)
- [x] 3.6 Test Gemini integration with sample requirement inputs and verify test cases are generated correctly

## 4. Backend - API Endpoints

- [x] 4.1 Create POST `/api/blackbox/bva/generate` endpoint with validation middleware
- [x] 4.2 Implement input validation: requirement_text length (50-2000 chars), user authentication check
- [ ] 4.3 Implement rate limiting middleware: max 5 requests per hour per user
- [x] 4.4 Implement endpoint logic: call Gemini service, save to database, return response
- [x] 4.5 Create GET `/api/blackbox/bva/history` endpoint to retrieve test case history
- [x] 4.6 Add proper error response handling with meaningful error messages (400, 429, 500 status codes)
- [ ] 4.7 Test API endpoints with Postman/curl

## 5. Backend - Export Functionality

- [x] 5.1 Create service function `exportToCSV(testCases): string` that formats test cases as CSV
- [x] 5.2 Create service function `exportToPDF(requirement, testCases, timestamp): Buffer` that generates PDF report
- [x] 5.3 Create POST `/api/blackbox/bva/export` endpoint that accepts format parameter (csv|pdf)
- [x] 5.4 Implement proper headers and filename for file download response
- [ ] 5.5 Test export functionality with various test case counts (small and large)

## 6. Frontend - Page Structure

- [x] 6.1 Create new route `/dashboard/blackbox/bva` in Next.js app directory
- [x] 6.2 Create layout component that includes sidebar navigation and top bar
- [x] 6.3 Create main page component structure with two main sections: input form section and results section
- [x] 6.4 Setup TypeScript interfaces for frontend (TestCase, APIResponse, etc.)

## 7. Frontend - Input Form Component

- [x] 7.1 Create BVAInputForm component with textarea for requirement input
- [x] 7.2 Add character counter (min 50, max 2000) with real-time validation
- [x] 7.3 Add "Generate" button that is disabled when input is invalid
- [x] 7.4 Add "Clear" button to reset form
- [x] 7.5 Add helpful placeholder text and instructions
- [x] 7.6 Add loading state during generation (spinner, disabled button)

## 8. Frontend - Test Cases Display Component

- [x] 8.1 Create TestCasesTable component to display generated test cases
- [x] 8.2 Implement table columns: Test ID, Test Name, Input (formatted), Expected Output, Boundary Type, Category
- [x] 8.3 Implement sorting functionality on table columns (click header to sort)
- [x] 8.4 Add row highlighting for different boundary types (color coding)
- [x] 8.5 Add "View Details" expand button to show full input/output for each row
- [x] 8.6 Add summary statistics (Total test cases, count by boundary type)

## 9. Frontend - Export & Action Buttons

- [x] 9.1 Create ActionButtons component with "Export CSV", "Export PDF", "Save", "Clear Results" buttons
- [x] 9.2 Implement CSV export handler that calls API and triggers download
- [x] 9.3 Implement PDF export handler that calls API and triggers download
- [x] 9.4 Add loading spinners during export operations
- [ ] 9.5 Add toast notifications for successful exports and errors

## 10. Frontend - Test Case History Component

- [ ] 10.1 Create TestCaseHistory component to display previous generations (optional but recommended)
- [ ] 10.2 Display list with: date, requirement preview (first 100 chars), test case count, actions (view/delete)
- [ ] 10.3 Implement view action to load previous test cases
- [ ] 10.4 Implement delete action to remove from history

## 11. Frontend - Error Handling & UX

- [ ] 11.1 Add error boundary component to catch and display errors gracefully
- [ ] 11.2 Create error message component for API errors (too many requests, invalid response, server errors)
- [ ] 11.3 Add helpful error messages that guide user on what to do
- [x] 11.4 Implement toast notification system for success/error messages
- [x] 11.5 Add loading skeleton while test cases are generating

## 12. Frontend - Integration & State Management

- [x] 12.1 Setup React state/Context or TanStack Query for managing: generated test cases, loading state, errors, history
- [x] 12.2 Create API client service functions: generateBVA(requirement), exportToCSV(testCases), exportToPDF(testCases)
- [x] 12.3 Wire up form submission to call generateBVA API
- [x] 12.4 Wire up export buttons to call export API functions
- [x] 12.5 Implement proper loading states and error handling throughout the flow

## 13. Testing

- [ ] 13.1 Write unit tests for Gemini API service (mock responses, error cases)
- [ ] 13.2 Write unit tests for export services (CSV and PDF generation)
- [ ] 13.3 Write integration tests for backend endpoints (generate, history, export)
- [ ] 13.4 Write frontend component tests for form input and table display
- [x] 13.5 Manual end-to-end testing: input requirement → generate → export → download

## 14. Documentation & Cleanup

- [x] 14.1 Add JSDoc comments to all API endpoints and service functions
- [x] 14.2 Add inline comments for complex BVA logic in Gemini prompt engineering
- [ ] 14.3 Create README section documenting BVA feature (how to use, requirements format tips)
- [ ] 14.4 Document environment variables needed (GEMINI_API_KEY, etc.)
- [ ] 14.5 Cleanup any console.log statements and debug code
- [ ] 14.6 Review code for security vulnerabilities (SQL injection, XSS, etc.) 

## 15. Deployment

- [ ] 15.1 Test full feature in staging environment
- [ ] 15.2 Monitor Gemini API usage and costs
- [ ] 15.3 Deploy to production with rollback plan ready
- [ ] 15.4 Monitor application logs for errors post-deployment
- [ ] 15.5 Gather user feedback and create GitHub issues for improvements
