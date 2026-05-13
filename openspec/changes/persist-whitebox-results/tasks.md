## 1. Database Schema

- [x] 1.1 Update `backend/prisma/schema.prisma` to add optional fields to `TestCase` and create the `Execution` model.
- [x] 1.2 Run `npx prisma migrate dev --name add_whitebox_persistence` to apply changes.

## 2. Backend Repository

- [x] 2.1 Update `whitebox.repository.js` to support updating `TestCase` with codes and script.
- [x] 2.2 Add `createExecution` function to `whitebox.repository.js`.

## 3. Backend Logic

- [x] 3.1 Update `generate` controller in `whitebox.controller.js` to save/update the `TestCase` in the DB.
- [x] 3.2 Update `run` controller in `whitebox.controller.js` to create an `Execution` record after the test run finishes.
- [x] 3.3 Create `system.controller.js` and `system.repository.js` to handle dashboard stats and history.
- [x] 3.4 Register dashboard endpoints in `routes/index.js`.
- [x] 3.5 Add authMiddleware and Authorization headers to whitebox endpoints.

## 4. Frontend Dashboard

- [x] 4.1 Create a `useDashboardStats` hook to fetch data from the backend.
- [x] 4.2 Update `frontend/src/app/(dashboard)/page.tsx` to use dynamic data for stats and recent executions.
- [x] 4.3 Add a basic detail view (modal or link) to see the generated script of a recent test.

## 5. Verification

- [ ] 5.1 Perform a whitebox generation and check the `TestCase` table in the DB.
- [ ] 5.2 Perform a whitebox run and verify the `Execution` record.
- [ ] 5.3 Open the dashboard and verify that the stats and recent activity are accurate.
