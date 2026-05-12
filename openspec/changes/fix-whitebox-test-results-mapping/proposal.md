# Proposal: Fix Whitebox Test Results Data Mapping

## Problem
The `TestResults` component in the whitebox page is crashing with a `TypeError: Cannot read properties of undefined (reading 'total')`. This is caused by a mismatch between the backend's response structure and what the frontend expects.
- **Backend Response**: Sends an envelope: `{ success: true, data: { results: { stats, tests }, ... } }`.
- **Frontend Expectation**: The `setTestResults` state (and the `TestResults` component) expects a direct object: `{ stats, tests }`.

## Goals
- Fix the frontend crash by correctly mapping the backend's results.
- Ensure the `TestResults` component receives the correct data structure.

## Proposed Changes
- **Frontend (`WhiteboxPage`)**: Update the `handleRun` method to extract `data.data.results` before calling `setTestResults`.

## Risks & Mitigations
- **Data Structure Changes**: If the backend structure changes again, this will break. *Mitigation*: We've standardized the backend response to use the `data` envelope, so we should stick to it.
