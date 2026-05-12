# Domain: Black Box Generator (Delta Spec)

## MODIFIED Requirements

### Requirement: Generate Test Cases from Requirements
Sistem HARUS menghasilkan test case berdasarkan input teks requirement dengan support penuh untuk BVA methodology.

#### Scenario: Generate BVA/EQP/DT
- **GIVEN** pengguna telah memilih tipe test (misal: BVA)
- **WHEN** pengguna menginput deskripsi requirement fitur
- **THEN** sistem menggunakan Gemini API untuk menganalisis batasan (boundaries) atau partisi logis
- **AND** menampilkan daftar test case di antarmuka Next.js

#### Scenario: Generate BVA with boundary identification
- **GIVEN** pengguna telah memilih tipe test "BVA"
- **WHEN** pengguna menginput requirement text dan klik "Generate"
- **THEN** sistem mengirim requirement ke Gemini API
- **AND** Gemini mengidentifikasi boundary values (lower boundary, upper boundary, exact values, invalid values)
- **AND** sistem generate test cases yang mengcover semua identified boundaries
- **AND** setiap test case HARUS memiliki: ID, name, input values, expected output, boundary type classification, dan category (valid/boundary/invalid)

#### Scenario: Validate and process BVA generation
- **GIVEN** requirement teks sudah diterima dan divalidasi
- **WHEN** Gemini API mengembalikan boundary analysis
- **THEN** sistem verifikasi bahwa hasil parsing valid
- **AND** jika parsing gagal, sistem retry dengan prompt alternative atau tampilkan error message yang membantu user rephrase requirement
- **AND** jika parsing sukses, sistem render test cases dalam tabel format untuk user review
