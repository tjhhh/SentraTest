## Why

Currently, whitebox test results (logs, screenshots, code) are only available during the session and are lost upon refresh or when a new test is run. We need to persist this data to PostgreSQL to allow users to review past test executions, track historical performance, and maintain a record of evidence for auditing purposes.

## What Changes

- **Database Schema**: Update `TestCase` model to include fields for `logicCode`, `uiCode`, and a relationship to a new `Execution` model.
- **New Model `Execution`**: Create a table to store individual run results, including status, duration, logs, and screenshot references.
- **Backend Service**: Update `whitebox.service.js` to save the generated code and execution results to the database.
- **Backend API**: Add endpoints to fetch summary statistics and a list of recent test cases for the dashboard.
- **Dashboard UI**: Update the main dashboard page to display real-time data from the database instead of static placeholders.

## Capabilities

### New Capabilities
- None.

### Modified Capabilities
- `whitebox`: Add requirements for data persistence of generated tests and execution results.
- `system`: Update dashboard requirements to show live test execution data.

## Impact

- **Backend**: `prisma/schema.prisma` (migration required), `whitebox.service.js`, `whitebox.repository.js`, `whitebox.controller.js`, `routes/index.js`.
- **Frontend**: `app/(dashboard)/page.tsx` (Dashboard page).
- **Database**: New `Execution` table and modified `TestCase` table.
