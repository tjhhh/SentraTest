## Context

The `BlackboxPage` component in `frontend/src/app/dashboard/blackbox/page.tsx` is disconnected from the backend. Its `handleGenerate` function simulates an API call with `setTimeout`, meaning the core feature is non-functional. A backend API endpoint at `POST /api/bb/generate` exists and is ready to serve requests. This design document outlines the plan to bridge this gap.

## Goals / Non-Goals

**Goals:**
- To replace the mocked API call in `handleGenerate` with a real, live call to the backend.
- To implement proper state management for the API request lifecycle (loading, success, error).
- To correctly parse the backend response and display the generated test cases in the UI.
- To provide clear error feedback to the user if the API call fails.

**Non-Goals:**
- This design does not cover any changes to the backend API or the AI prompt generation.
- It will not introduce any new UI components, other than potentially leveraging a project-wide notification/toast system if one exists.
- It will not change the requirements or behavior of the Black Box feature as defined in the spec.

## Decisions

### 1. API Abstraction
- **Decision:** The API call logic will be placed within a new `generateTestCases` method in the `frontend/src/services/bb.service.ts` file.
- **Rationale:** This adheres to the existing architectural pattern in the codebase, which separates API service logic from component logic. It improves maintainability and reusability.
- **Alternative Considered:** Making the `fetch` or `axios` call directly within the `page.tsx` component. This was rejected because it tightly couples the component to the API implementation and violates the separation of concerns principle.

### 2. State Management
- **Decision:** The existing `useState` hooks (`isGenerating`, `results`) within `page.tsx` will be used to manage the component's state.
- **Rationale:** The state for this feature is simple and localized to this one component. Introducing a more complex global state manager would be unnecessary overhead. The `isGenerating` flag will handle the loading state, and `setResults` will handle the success state.
- **Alternative Considered:** Using a global state manager like Zustand. This was deemed overkill for this component's needs.

### 3. Error Handling and User Notification
- **Decision:** A `try...catch` block will wrap the API call. In case of an error, the error will be logged to the console, and a simple browser `alert()` will be used to notify the user.
- **Rationale:** This provides immediate, unambiguous feedback to the user with zero new dependencies. While not the most elegant UI, it is robust and sufficient for making the feature functional.
- **Alternative Considered:** Implementing a toast notification library (e.g., `react-hot-toast`). This was rejected to keep the scope of this change minimal. A separate task can be created later to implement a standardized, application-wide notification system.

## Risks / Trade-offs

- **Risk:** The backend API response structure might not perfectly match the frontend's expectations or the mocked data structure.
  - **Mitigation:** Before implementing the frontend change, the developer must first test the `POST /api/bb/generate` endpoint manually (e.g., with curl or Postman) to verify the exact response structure and ensure the frontend parsing logic matches it precisely.

- **Trade-off:** Using `alert()` for error notification is blocking and provides a poor user experience compared to a non-blocking toast.
  - **Mitigation:** This is a deliberate choice to prioritize functionality with minimal changes. A future task should be created to replace these alerts with a unified notification component across the application.
