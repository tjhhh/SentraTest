## MODIFIED Requirements

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
