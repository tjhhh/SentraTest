## ADDED Requirements

### Requirement: Live Dashboard Statistics
The dashboard SHALL display real-time statistics aggregated from the database.

#### Scenario: View dashboard stats
- **WHEN** the user opens the dashboard page.
- **THEN** the system fetches total test cases and success rates from the backend.
- **AND** the UI updates the stat cards with current data.

### Requirement: Recent Activity Feed
The dashboard SHALL list the most recent test executions with their status and time.

#### Scenario: View recent activity
- **WHEN** the user navigates to the dashboard.
- **THEN** the system displays a list of the last 5-10 test executions.
- **AND** each item shows the test name, type (Whitebox/Blackbox), status (Passed/Failed), and relative time.
