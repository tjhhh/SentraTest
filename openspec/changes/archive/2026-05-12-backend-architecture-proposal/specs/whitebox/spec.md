## MODIFIED Requirements

### Requirement: Code-Based Test Generation
Sistem HARUS mampu memproses potongan kode untuk menghasilkan testcase white-box berdasarkan kriteria coverage Statement, Branch, dan Path melalui endpoint backend.

#### Scenario: Selection & Generation
- **WHEN** pengguna memilih tipe coverage dan mengirim potongan kode valid
- **THEN** sistem SHALL menganalisis struktur kode menggunakan AI service
- **THEN** sistem SHALL mengembalikan testcase yang memenuhi coverage terpilih

### Requirement: Playwright Script Generation
Sistem HARUS menghasilkan script automation berbasis Playwright yang valid dari output analisis white-box.

#### Scenario: Generate Automation Script
- **WHEN** pengguna memicu aksi generate script pada hasil white-box
- **THEN** sistem SHALL menghasilkan script Playwright dengan struktur yang dapat langsung dijalankan

### Requirement: Remote Script Execution (Run on Web)
Sistem HARUS dapat mengeksekusi script Playwright yang dihasilkan dan mengembalikan hasil eksekusi secara realtime.

#### Scenario: Run Test & Show Output
- **WHEN** pengguna menekan aksi run test untuk script yang valid
- **THEN** sistem SHALL mengeksekusi script di lingkungan backend terisolasi
- **THEN** sistem SHALL mengirim status pass/fail dan log eksekusi untuk ditampilkan di antarmuka
