## Domain: Universal Sandbox Renderer

### Requirement: HTML Template Composition
The system SHALL wrap the logic and UI snippets into a valid HTML5 boilerplate.

#### Scenario: Generate sandbox file
- **WHEN** logic and UI are provided.
- **THEN** system produces an `index.html` where logic is in `<script>` and UI is in `<body>`.

### Requirement: Framework Auto-Injection
The system SHALL inject framework scripts (e.g., Vue, React via CDN) if it detects framework-specific syntax in the UI snippet.

#### Scenario: Inject Vue CDN
- **WHEN** UI snippet contains `@click` or `v-if`.
- **THEN** system adds `<script src="https://unpkg.com/vue@3"></script>` to the sandbox.
