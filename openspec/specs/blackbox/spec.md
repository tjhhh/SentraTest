# Domain: Black Box Generator

## Requirements

### Requirement: Black Box Test Selection Flow
Sistem HARUS memandu pengguna melalui alur pemilihan tipe pengujian sebelum melakukan generasi.

#### Scenario: Selection Process
- GIVEN pengguna berada di dashboard
- WHEN pengguna memilih kategori "Blackbox Testing"
- THEN sistem menampilkan pilihan tipe: BVA (Boundary Value Analysis), EQP (Equivalence Partitioning), dan DT (Decision Table)

### Requirement: Generate Test Cases from Requirements
Sistem HARUS menghasilkan test case berdasarkan input teks requirement.

#### Scenario: Generate BVA/EQP/DT
- GIVEN pengguna telah memilih tipe test (misal: BVA)
- WHEN pengguna menginput deskripsi requirement fitur
- THEN sistem menggunakan Gemini API untuk menganalisis batasan (boundaries) atau partisi logis
- AND menampilkan daftar test case di antarmuka Next.js

### Requirement: Export Functionality
- Sistem HARUS menyediakan fitur ekspor hasil test case ke format CSV atau PDF.