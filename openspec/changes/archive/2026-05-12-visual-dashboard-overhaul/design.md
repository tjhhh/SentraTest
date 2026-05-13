## Context

The current UI is functional but purely technical. To transition to a "Low-Code/No-Code" testing platform experience, we need to bridge the gap between raw test execution and visual understanding.

## Goals / Non-Goals

**Goals:**
- Provide real-time visual feedback for UI code.
- Transform log streams into a structured timeline.
- Capture and display visual evidence (screenshots).
- Maintain a clean, professional dashboard layout.

**Non-Goals:**
- Real-time video streaming (too heavy for now).
- Interactive debugging within the iframe (read-only preview).

## Decisions

### 1. Iframe `srcDoc` for Preview
We will use the `srcDoc` attribute of an `<iframe>` to render the user-provided UI code.
- **Rationale**: It allows for isolated, instant rendering without needing a full build step or server-side rendering.

### 2. Regex-based Step Parsing
The frontend will use regex to parse the incoming log stream for patterns like `[STEP: TYPE] description`.
- **Rationale**: Simple to implement and flexible enough for the current scope.

### 3. Static File Serving for Screenshots
The backend will use `express.static` to serve a `screenshots` directory.
- **Rationale**: Allows the frontend to easily reference images via URL.

### 4. Grid Layout (2-Column)
We will use a 1/3 - 2/3 grid or a 50/50 split to balance code editing and visual results.

## Risks / Trade-offs

- **[Risk]** Iframe security → **Mitigation**: Use `sandbox` attribute on iframe to restrict script execution if necessary, although we want scripts to run in this context.
- **[Risk]** Storage bloat from screenshots → **Mitigation**: Clear the screenshots directory on every new "Run Test" or periodically.
- **[Risk]** Log parsing fragility → **Mitigation**: Define a strict internal log format for Gemini to follow.
