# Domain: BVA Test Generation

## ADDED Requirements

### Requirement: Accept Functional Requirement Input
Sistem HARUS menerima input teks requirement fungsional dari user dengan validasi panjang dan format.

#### Scenario: Valid requirement submission
- **WHEN** user memasukkan requirement text minimal 50 karakter dan maksimal 2000 karakter di form
- **THEN** sistem menerima input dan enable tombol "Generate"

#### Scenario: Invalid requirement input
- **WHEN** user memasukkan requirement kurang dari 50 karakter
- **THEN** sistem menampilkan pesan error dan disable tombol "Generate"

### Requirement: Generate BVA Test Cases via AI
Sistem HARUS menganalisis requirement input menggunakan Gemini API dan menghasilkan test cases berdasarkan Boundary Value Analysis methodology.

#### Scenario: Successful test case generation
- **GIVEN** user telah memasukkan valid requirement
- **WHEN** user mengklik tombol "Generate"
- **THEN** sistem mengirim requirement ke Gemini API untuk analisis boundaries
- **AND** Gemini mengidentifikasi boundary values dan generate test cases
- **AND** sistem menampilkan daftar test cases dalam format tabel

#### Scenario: Generation with identified boundaries
- **GIVEN** Gemini API berhasil menganalisis requirement
- **WHEN** sistem menerima response dari Gemini
- **THEN** test cases HARUS memiliki atribut: test ID, test name, input values, expected output, boundary type (lower/upper/exact/invalid), dan category (valid/boundary/invalid)

### Requirement: Display BVA Test Cases
Sistem HARUS menampilkan generated test cases dalam format yang mudah dibaca dan dapat di-sort/filter.

#### Scenario: Test case table display
- **GIVEN** test cases telah di-generate
- **WHEN** sistem menampilkan hasil
- **THEN** sistem menampilkan tabel dengan kolom: Test ID, Test Name, Input, Expected Output, Boundary Type, dan Category

#### Scenario: Sort test cases
- **GIVEN** test cases ditampilkan di tabel
- **WHEN** user mengklik header kolom
- **THEN** sistem mengurutkan test cases berdasarkan kolom tersebut (ascending/descending)

### Requirement: Export Test Cases
Sistem HARUS menyediakan fitur export test cases ke format CSV dan PDF.

#### Scenario: Export to CSV
- **GIVEN** test cases telah di-generate
- **WHEN** user mengklik tombol "Export CSV"
- **THEN** sistem generate file CSV dengan kolom: Test ID, Test Name, Input, Expected Output, Boundary Type, Category
- **AND** browser download file dengan nama format: `bva_testcases_[timestamp].csv`

#### Scenario: Export to PDF
- **GIVEN** test cases telah di-generate
- **WHEN** user mengklik tombol "Export PDF"
- **THEN** sistem generate file PDF dengan header (requirement teks, tanggal generate), test cases tabel, dan summary statistik (total test cases, breakdown by boundary type)
- **AND** browser download file dengan nama format: `bva_testcases_[timestamp].pdf`

### Requirement: Handle API Errors
Sistem HARUS menangani error dari Gemini API dengan graceful error messages dan retry mechanism.

#### Scenario: API rate limit exceeded
- **GIVEN** user mencoba generate test cases
- **WHEN** Gemini API mengembalikan rate limit error
- **THEN** sistem menampilkan pesan "Too many requests. Please try again in X minutes"
- **AND** sistem meng-queue request untuk retry otomatis

#### Scenario: Invalid API response
- **GIVEN** Gemini API mengembalikan response yang tidak parseable
- **WHEN** sistem mencoba parse response
- **THEN** sistem menampilkan pesan "Failed to generate test cases. Please rephrase your requirement and try again"

### Requirement: Save Test Case History
Sistem HARUS menyimpan history generated test cases untuk reference dan audit trail.

#### Scenario: Auto-save generated test cases
- **GIVEN** test cases berhasil di-generate
- **WHEN** sistem menerima response dari Gemini API
- **THEN** sistem automatically menyimpan test cases ke database dengan metadata: ID (UUID), requirement_text, test_cases (JSON), created_at, user_id

#### Scenario: View test case history
- **GIVEN** user telah melakukan generate test cases sebelumnya
- **WHEN** user membuka halaman BVA Testing
- **THEN** sistem menampilkan list history dengan tanggal, requirement preview, dan jumlah test cases generated
