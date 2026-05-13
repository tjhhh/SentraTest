## 1. Backend Implementation

- [x] 1.1 Update Gemini prompt in `backend/src/modules/whitebox/whitebox.service.js` to include relationship validation and refusal rule.
- [x] 1.2 Modify `generateTestScript` in `whitebox.service.js` to parse and return the `refusal` field.
- [x] 1.3 Update `generate` controller in `whitebox.controller.js` to pass the `refusal` field in the API response.

## 2. Frontend Implementation

- [x] 2.1 Add `refusalMessage` state to `WhiteboxPage.tsx`.
- [x] 2.2 Update `handleProcess` in `WhiteboxPage.tsx` to set `refusalMessage` when the backend returns a refusal.
- [x] 2.3 Implement the refusal warning UI component (Alert) in `WhiteboxPage.tsx`.
- [x] 2.4 Ensure `testResults` and `refusalMessage` are cleared correctly when starting a new generation.

## 3. Verification

- [x] 3.1 Test with related UI/Logic and ensure generation still works.
- [x] 3.2 Test with completely unrelated UI/Logic and verify the refusal message is displayed correctly.
