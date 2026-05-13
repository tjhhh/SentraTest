## 1. Restore API Integration

- [x] 1.1 Restore `chatId` and `error` state in `AssistantPage` component.
- [x] 1.2 Restore `initChat` effect to call `POST /api/chats` on mount.
- [x] 1.3 Restore `handleSend` to call `POST /api/chats/:id/explain-bug` or `POST /api/chats/:id/messages` based on input.

## 2. Robust Response Handling

- [x] 2.1 Update `handleSend` response parsing to check if `data.explanation` is a string or an object.
- [x] 2.2 Implement safe property access for `errorExplanation`, `possibleCauses`, and `debuggingSteps` with fallback defaults.

## 3. Error Handling

- [x] 3.1 Wrap API calls in `try...catch` blocks to prevent uncaught errors.
- [x] 3.2 Add a user-friendly error message from the 'assistant' role in the chat state when a fetch fails.
