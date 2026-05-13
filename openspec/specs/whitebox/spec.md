# Domain: White-Box Test Case Generator

## 1. Requirements

### Requirement: Comprehensive Code Analysis with Gemini
The system SHALL use the Gemini API to analyze various source code files supported by the Playwright ecosystem, including JavaScript, TypeScript, and HTML/JSX.

#### Scenario: Analyze cross-file logic and paths
- **WHEN** the user provides multiple related files (e.g., a Next.js frontend component and an Express.js backend controller).
- **THEN** Gemini returns a structured analysis of logical branches and execution paths across the full stack.

### Requirement: Code-Based Test Generation
Sistem HARUS mampu memproses potongan kode untuk menghasilkan test case berdasarkan struktur internal kode, serta mengembalikan metadata mengenai tes yang dihasilkan.

#### Scenario: Selection & Generation with Metadata
- *GIVEN* pengguna memilih tipe coverage (Statement, Branch, atau Path).
- *WHEN* pengguna menginput potongan kode JavaScript/Node.js.
- *THEN* sistem menggunakan Gemini API untuk menghasilkan skenario pengujian yang memenuhi kriteria coverage tersebut.
- *AND* sistem mengembalikan daftar judul test case yang dihasilkan sebagai bagian dari respon metadata.

### Requirement: Structured Generation Response
The system SHALL return a structured response after test generation that includes the Playwright script and a list of identified test cases.

#### Scenario: Parse structured generation
- **WHEN** the backend receives the generation result from Gemini.
- **THEN** it parses the test titles from the script or structured block.
- **AND** it returns a JSON response containing `{ script, testTitles }`.

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

### Requirement: Persistent Session State
Sistem MUST menyimpan kode logic dan UI ke dalam database setiap kali pengguna melakukan analisis atau generasi skrip.

#### Scenario: Auto-saving code session
- **WHEN** pengguna menekan tombol "Generate Tests" pada halaman Whitebox
- **THEN** sistem SHALL mengirimkan `logicCode` dan `uiCode` beserta `conversationId` ke backend
- **THEN** sistem SHALL menyimpan data tersebut sebagai payload `TestCase` yang tertaut pada percakapan tersebut

### Requirement: Restore Whitebox Session
Sistem MUST memulihkan kode logic, UI, dan hasil tes terakhir ketika sebuah sesi Whitebox dipilih dari riwayat.

#### Scenario: Loading previous whitebox session
- **WHEN** pengguna memilih riwayat chat yang merupakan sesi Whitebox
- **THEN** sistem SHALL melakukan navigasi ke halaman `/dashboard/whitebox`
- **THEN** sistem SHALL memuat payload `TestCase` terakhir untuk mengisi editor logic, editor UI, dan tabel hasil tes