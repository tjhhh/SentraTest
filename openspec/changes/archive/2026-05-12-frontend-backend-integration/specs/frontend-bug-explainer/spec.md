## ADDED Requirements

### Requirement: Bug Explanation Tool
Sistem MUST menyediakan area input untuk menempelkan stack trace error dan menampilkan hasil analisis AI.

#### Scenario: Analyze Error Log
- **WHEN** pengguna menempelkan stack trace dan menekan tombol "Analyze Bug"
- **THEN** sistem SHALL memanggil endpoint `/api/bug/explain`
- **THEN** sistem SHALL menampilkan ringkasan penyebab dan saran perbaikan yang terstruktur
