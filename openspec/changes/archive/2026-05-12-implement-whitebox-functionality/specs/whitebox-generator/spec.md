## ADDED Requirements
### Requirement: Comprehensive Code Analysis with Gemini
The system SHALL use the Gemini API to analyze various source code files supported by the Playwright ecosystem, including JavaScript, TypeScript, and HTML/JSX.

### Scenario: Analyze cross-file logic and paths
-**WHEN** the user provides multiple related files (e.g., a Next.js frontend component and an Express.js backend controller).
-**THEN** Gemini returns a structured analysis of logical branches and execution paths across the full stack.

### Requirement: Full-Stack Playwright Script Generation
The generated Playwright script SHALL follow standard industry templates, including imports, stable locators (Page Object Model preferred), and assertions that verify functional behavior.

### Scenario: Generate valid .spec.ts for E2E testing
-**WHEN** the code analysis is complete and a specific coverage metric is selected.
-**THEN** the system produces a valid TypeScript-based Playwright test suite (.spec.ts) that includes assertions for UI elements and API responses.
