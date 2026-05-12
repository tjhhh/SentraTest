## 1. Backend - API Setup

- [x] 1.1 Create `decisionTableService.js` dengan function `generateDecisionTable(requirement)`
- [x] 1.2 Create `decisionTable.js` route handler untuk `POST /api/decision-table`
- [x] 1.3 Register route di `server.js`
- [x] 1.4 Test API endpoint dengan Postman/curl

## 2. Backend - Gemini Integration

- [x] 2.1 Design system prompt untuk Gemini yang mengidentifikasi conditions dan actions
- [x] 2.2 Implement JSON parsing dari Gemini response
- [x] 2.3 Add error handling dan retry logic
- [x] 2.4 Test dengan berbagai requirement inputs

## 3. Frontend - Components

- [x] 3.1 Create `DecisionTableInputForm.tsx` - form untuk input requirement
- [x] 3.2 Create `DecisionTableDisplay.tsx` - display conditions, actions, test cases
- [x] 3.3 Create route `/blackbox/decision-table`
- [x] 3.4 Add navigation link di halaman blackbox

## 4. Frontend - Integration

- [x] 4.1 Wire up form submission ke API
- [x] 4.2 Parse API response dan format untuk display
- [x] 4.3 Implement error handling dan error messages
- [x] 4.4 Add loading states

## 5. Export Functionality (Future)

- [x] 5.1 Implement CSV export
- [x] 5.2 Implement PDF export
- [x] 5.3 Add export buttons

## 6. Testing & Deployment

- [x] 6.1 End-to-end testing dengan berbagai requirements
- [x] 6.2 Test export functionality
- [x] 6.3 Deploy ke production
