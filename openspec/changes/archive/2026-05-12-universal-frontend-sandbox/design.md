## Context

The current system handles JavaScript logic but lacks the ability to test UI interactions. We need to create a "Sandbox" environment where UI and logic can coexist so Playwright can perform end-to-end component testing.

## Goals / Non-Goals

**Goals:**
- Implement a dual-editor interface in the frontend.
- Implement a sandbox renderer in the backend that creates a temporary `sandbox.html`.
- Update the Gemini prompt to be "UI-aware".
- Support basic framework injection via CDN.

**Non-Goals:**
- Full framework build steps (Vite/Webpack). We rely on CDN versions of frameworks.
- Complex state management between Logic and UI (beyond what the user provides).

## Decisions

### 1. File-based Sandbox
We will create a `sandbox.html` file in the backend. Playwright will then use `page.goto('file://...')` or a local static server to open it.
- **Rationale**: Simplest way to render user-provided HTML and JS together.

### 2. Prompt Engineering for UI
The prompt to Gemini will be expanded to include both `logicCode` and `uiCode`. Gemini will be instructed to find interactive elements (buttons, inputs) and write tests that interact with them.

### 3. Frontend Layout
We will use a side-by-side or stacked layout for the two editors (Logic and UI) to maximize screen real estate.

## Risks / Trade-offs

- **[Risk]** Sanitization of user HTML → **Mitigation**: The sandbox is local to the backend process and only runs Playwright. However, we should be cautious about script injection in the sandbox.
- **[Risk]** Framework Version Conflicts → **Mitigation**: Use fixed CDN versions or allow users to specify.
