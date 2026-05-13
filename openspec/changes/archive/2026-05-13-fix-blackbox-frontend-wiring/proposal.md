## Why

The "Black Box" feature is currently non-functional because the frontend UI is not connected to the backend service. The "Generate" button uses a mocked, simulated API call, preventing users from generating real test cases. This change will wire up the UI to the existing backend, making the feature operational as intended.

## What Changes

- The simulated API call (`setTimeout`) in the `handleGenerate` function will be replaced with a real API call to the backend service.
- A new method will be added to a frontend service (`bb.service.ts`) to handle the `POST /api/bb/generate` request.
- The UI will be updated to handle the asynchronous nature of the real API call, including managing a "loading" state.
- Error handling will be implemented to inform the user if the API call fails.

## Capabilities

### New Capabilities
*None*

### Modified Capabilities
*None*

This change is purely an implementation fix to make the existing `blackbox` capability functional. The requirements defined in `openspec/specs/blackbox/spec.md` are not changing.

## Impact

- **Code:**
  - `frontend/src/app/dashboard/blackbox/page.tsx`: Major modifications to connect the generate button to a real API call.
  - `frontend/src/services/bb.service.ts`: A new method will be added to this service to handle the API communication.
- **APIs:** The existing `POST /api/bb/generate` endpoint will now be actively used by the frontend.
