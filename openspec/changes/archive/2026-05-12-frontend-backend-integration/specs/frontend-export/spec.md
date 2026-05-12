## ADDED Requirements

### Requirement: Multi-format Result Export
Sistem MUST menyediakan opsi bagi pengguna untuk mengunduh hasil pengujian dalam format PDF, JSON, atau ZIP.

#### Scenario: Download PDF Report
- **WHEN** pengguna menekan tombol "Export PDF" pada hasil generasi
- **THEN** sistem SHALL memanggil endpoint `/api/export/pdf`
- **THEN** sistem SHALL memicu proses pengunduhan file di browser pengguna
