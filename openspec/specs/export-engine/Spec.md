# Domain: Export Engine

## Requirements

### Requirement: CSV Export
Sistem HARUS mengekspor test case ke format CSV.

#### Scenario: Export Test Cases to CSV
- GIVEN pengguna dengan daftar test case yang telah di-generate
- WHEN pengguna memilih "Export to CSV"
- THEN sistem generate file CSV dengan kolom: ID, Judul, Precondition, Steps, Expected Result, Tipe, Prioritas, Metode
- AND file di-download dengan nama: test-cases-[timestamp].csv
- AND format CSV sesuai RFC 4180
- AND special characters di-escape dengan benar

#### Scenario: CSV with Custom Delimiter
- GIVEN pengguna perlu CSV dengan delimiter spesifik
- WHEN pengguna memilih opsi custom delimiter (comma, semicolon, tab)
- THEN sistem generate CSV dengan delimiter yang dipilih
- AND sistem handle fields yang mengandung delimiter dengan quotation marks

### Requirement: JSON Export
Sistem HARUS mengekspor test case ke format JSON.

#### Scenario: Export Test Cases to JSON
- GIVEN pengguna dengan test cases
- WHEN pengguna memilih "Export to JSON"
- THEN sistem generate JSON array dengan struktur terstandarisasi
- AND setiap test case object memiliki properties: id, title, precondition, steps (array), expectedResult, type, priority, method
- AND JSON valid dan dapat di-parse
- AND file di-download: test-cases-[timestamp].json

#### Scenario: JSON for API Integration
- GIVEN sistem lain perlu consume test cases via API
- WHEN pengguna export ke JSON
- THEN sistem generate JSON schema yang sesuai dengan OpenAPI spec
- AND JSON include metadata (created_at, generated_by, version)
- AND format ready untuk import ke sistem lain

### Requirement: Excel Export
Sistem HARUS mengekspor test case ke format Excel (.xlsx).

#### Scenario: Export to Excel with Formatting
- GIVEN pengguna dengan test cases
- WHEN pengguna memilih "Export to Excel"
- THEN sistem generate file .xlsx menggunakan library (seperti xlsx atau exceljs)
- AND file memiliki formatting profesional (header bold, alternating row colors)
- AND kolom auto-sized untuk readability
- AND multiple sheets jika ada kategori berbeda (Positive, Negative, Edge Cases)

#### Scenario: Excel with Filters
- GIVEN pengguna export test cases dalam jumlah banyak (>50)
- WHEN sistem generate Excel
- THEN sistem enable auto-filter pada header row
- AND pengguna dapat sort dan filter di Excel
- AND conditional formatting untuk priority (High=red, Medium=yellow, Low=green)

#### Scenario: Excel Report with Summary
- GIVEN pengguna ingin laporan lengkap
- WHEN pengguna memilih "Export Excel Report"
- THEN sistem generate sheet "Summary" dengan statistik (total test cases, per type, per priority)
- AND sheet "Test Cases" dengan semua detail
- AND sheet "Coverage" dengan metrics coverage

### Requirement: PDF Export
Sistem HARUS mengekspor test case ke format PDF untuk dokumentasi.

#### Scenario: Export to PDF
- GIVEN pengguna dengan test cases
- WHEN pengguna memilih "Export to PDF"
- THEN sistem generate PDF dengan layout profesional
- AND PDF include: cover page, table of contents, test cases detail
- AND formatting konsisten (font, spacing, headers)
- AND file di-download: test-cases-report-[timestamp].pdf

#### Scenario: PDF with Company Branding
- GIVEN pengguna perlu PDF dengan branding perusahaan
- WHEN pengguna upload logo atau pilih template
- THEN sistem include logo di header PDF
- AND sistem apply color scheme sesuai template
- AND PDF terlihat professional untuk presentasi

### Requirement: Test Script ZIP Export
Sistem HARUS package skrip otomasi dalam format ZIP.

#### Scenario: Export Test Scripts as ZIP
- GIVEN pengguna telah generate multiple test scripts
- WHEN pengguna memilih "Download All Scripts"
- THEN sistem package semua skrip dalam ZIP file
- AND struktur folder organized (by framework: playwright/, cypress/, selenium/)
- AND include dependencies files (package.json, requirements.txt)
- AND include README.md dengan setup instructions

#### Scenario: ZIP with Execution Guide
- GIVEN pengguna download test scripts
- WHEN sistem generate ZIP
- THEN sistem include file GUIDE.md dengan:
  - Cara install dependencies
  - Cara run tests
  - Cara interpret results
  - Troubleshooting tips

### Requirement: Export History & Management
Sistem HARUS mencatat riwayat ekspor yang dilakukan pengguna.

#### Scenario: View Export History
- GIVEN pengguna yang pernah melakukan ekspor
- WHEN pengguna mengakses halaman "Export History"
- THEN sistem menampilkan daftar ekspor sebelumnya (tanggal, format, jumlah test cases)
- AND pengguna dapat download ulang file yang pernah di-export
- AND history tersimpan di database (max 30 hari)

#### Scenario: Delete Export History
- GIVEN pengguna ingin cleanup export history
- WHEN pengguna memilih untuk delete history
- THEN sistem menghapus record dari database
- AND file di storage dihapus (jika ada)
- AND sistem konfirmasi sebelum delete