## ADDED Requirements

### Requirement: Black Box Test Generation UI
Sistem MUST menyediakan form untuk input requirement dan pemilihan metode pengujian black box (BVA, EQP, DT).

#### Scenario: Generate Black Box Testcase
- **WHEN** pengguna memilih metode "BVA" dan memasukkan deskripsi fitur lalu menekan tombol generate
- **THEN** sistem SHALL memanggil endpoint `/api/bb/generate`
- **THEN** sistem SHALL menampilkan hasil tabel testcase pada UI

### Requirement: White Box Analysis Interface
Sistem MUST memungkinkan pengguna untuk mengunggah atau menempelkan potongan kode untuk analisis coverage.

#### Scenario: Analyze Source Code
- **WHEN** pengguna memasukkan kode sumber dan memilih coverage "Branch"
- **THEN** sistem SHALL memanggil endpoint `/api/wb/analyze`
- **THEN** sistem SHALL menampilkan hasil analisis coverage pada UI
