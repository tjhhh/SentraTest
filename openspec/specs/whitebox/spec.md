# Domain: White Box Generator

## 1. Requirements

### Requirement: Comprehensive Code Analysis with Gemini
The system SHALL use the Gemini API to analyze various source code files supported by the Playwright ecosystem, including JavaScript, TypeScript, and HTML/JSX.

#### Scenario: Analyze cross-file logic and paths
- **WHEN** the user provides multiple related files (e.g., a Next.js frontend component and an Express.js backend controller).
- **THEN** Gemini returns a structured analysis of logical branches and execution paths across the full stack.

### Requirement: Code-Based Test Generation
Sistem HARUS mampu memproses potongan kode untuk menghasilkan test case berdasarkan struktur internal kode.

#### Scenario: Selection & Generation
- *GIVEN* pengguna memilih tipe coverage (Statement, Branch, atau Path).
- *WHEN* pengguna menginput potongan kode JavaScript/Node.js.
- *THEN* sistem menggunakan Gemini API untuk menghasilkan skenario pengujian yang memenuhi kriteria coverage tersebut.

### Requirement: Full-Stack Playwright Script Generation
The generated Playwright script SHALL follow standard industry templates, including imports, stable locators (Page Object Model preferred), and assertions that verify functional behavior.

#### Scenario: Generate valid .spec.ts for E2E testing
- **WHEN** the code analysis is complete and a specific coverage metric is selected.
- **THEN** the system produces a valid TypeScript-based Playwright test suite (.spec.ts) that includes assertions for UI elements and API responses.

### Requirement: Remote Script Execution (Run on Web)
Sistem HARUS dapat mengeksekusi script Playwright yang dihasilkan dan menampilkan hasilnya secara real-time.

#### Scenario: Run Test & Show Output
- *GIVEN* script Playwright telah digenerate.
- *WHEN* pengguna menekan tombol "Run Test".
- *THEN* Backend (Express.js) mengeksekusi script tersebut menggunakan Playwright Runner di lingkungan terisolasi.
- *AND* sistem menangkap output konsol dan status akhir.
- *AND* Frontend (Next.js) menampilkan status "PASS" (hijau) atau "FAIL" (merah) beserta log detailnya.