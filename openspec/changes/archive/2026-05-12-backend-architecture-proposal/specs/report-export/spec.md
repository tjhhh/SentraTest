## ADDED Requirements

### Requirement: Multi-format Export
Sistem MUST menyediakan endpoint export hasil pengujian ke format PDF, DOCX, JSON, dan ZIP project Playwright.

#### Scenario: Export JSON
- **WHEN** pengguna meminta export dengan format JSON dan data valid
- **THEN** sistem SHALL menghasilkan file JSON yang berisi test case dan metadata pengujian

#### Scenario: Export PDF or DOCX
- **WHEN** pengguna meminta export PDF atau DOCX untuk laporan pengujian
- **THEN** sistem SHALL menghasilkan file dokumen dengan ringkasan hasil, detail test case, dan status

#### Scenario: Export Playwright ZIP
- **WHEN** pengguna meminta export project Playwright
- **THEN** sistem SHALL menghasilkan arsip ZIP yang berisi struktur project dan script yang dapat dieksekusi

### Requirement: Export Auditability
Sistem MUST mencatat metadata export untuk kebutuhan histori dan troubleshooting.

#### Scenario: Record export metadata
- **WHEN** export berhasil dibuat
- **THEN** sistem SHALL menyimpan metadata export (format, waktu, pemilik, referensi data) ke database
