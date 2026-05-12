# Domain: Decision Table Test Generation

## ADDED Requirements

### Requirement: Accept Functional Requirement Input
Sistem HARUS menerima input teks requirement dengan validasi panjang dan format.

#### Scenario: Valid requirement submission
- **WHEN** user memasukkan requirement text minimal 50 karakter dan maksimal 2000 karakter
- **THEN** sistem menerima input dan enable tombol "Generate Decision Table"

### Requirement: Generate Decision Table via AI
Sistem HARUS menganalisis requirement menggunakan Gemini API dan generate Decision Table dengan conditions dan actions.

#### Scenario: Successful Decision Table generation
- **GIVEN** user telah memasukkan valid requirement
- **WHEN** user mengklik tombol "Generate Decision Table"
- **THEN** sistem mengirim requirement ke Gemini API untuk analyze conditions dan actions
- **AND** Gemini mengidentifikasi semua conditions dan actions dari requirement
- **AND** sistem generate test cases covering semua condition combinations

### Requirement: Display Decision Table Components
Sistem HARUS menampilkan identified conditions, actions, dan test case combinations.

#### Scenario: Display conditions and actions
- **GIVEN** Decision Table telah di-generate
- **WHEN** sistem menampilkan hasil
- **THEN** sistem menampilkan list of conditions dengan nama dan tipe
- **AND** sistem menampilkan list of actions yang bisa terjadi

#### Scenario: Display test cases table
- **GIVEN** Conditions dan actions sudah diidentifikasi
- **WHEN** sistem menampilkan test case table
- **THEN** setiap test case menampilkan: ID, name, condition values, expected actions, description, category

### Requirement: Export Functionality
Sistem HARUS support export ke CSV dan PDF format.

#### Scenario: Export to CSV
- **GIVEN** Decision Table sudah di-generate
- **WHEN** user mengklik "Export CSV"
- **THEN** browser download file dengan nama `decision_table_[timestamp].csv`

#### Scenario: Export to PDF
- **GIVEN** Decision Table sudah di-generate
- **WHEN** user mengklik "Export PDF"
- **THEN** browser download formatted PDF report dengan conditions, actions, dan test cases
