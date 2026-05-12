# Tasks: Fix Whitebox Streaming and Scripting

- [x] 1. Refactor `whitebox.service.js` `runTestScript` to support streaming via callback.
- [x] 2. Update `whitebox.controller.js` `run` method to use streaming response (`res.write`).
- [x] 3. Update Gemini prompt in `whitebox.service.js` to improve `<input type="number">` handling and log clarity.
- [x] 4. Verify that logs appear in real-time in the Sentra Sandbox UI.
- [x] 5. Verify that "Invalid Input" test cases for number fields now report correctly (either by passing or showing a valid browser block).
