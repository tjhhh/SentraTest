# Domain: Black Box Generator

## Requirements

### Requirement: Black Box Test Selection Flow
Sistem HARUS memandu pengguna melalui alur pemilihan tipe pengujian sebelum melakukan generasi.

#### Scenario: Selection Process
- GIVEN pengguna berada di dashboard
- WHEN pengguna memilih kategori "Blackbox Testing"
- THEN sistem menampilkan pilihan tipe: BVA (Boundary Value Analysis), EQP (Equivalence Partitioning), dan DT (Decision Table)

### Requirement: Black Box Test Generation UI
Sistem MUST menyediakan form untuk input requirement dan pemilihan metode pengujian black box (BVA, EQP, DT).

#### Scenario: Generate Black Box Testcase
- **WHEN** pengguna memilih metode "BVA" dan memasukkan deskripsi fitur lalu menekan tombol generate
- **THEN** sistem SHALL memanggil endpoint `/api/bb/generate`
- **THEN** sistem SHALL menampilkan hasil tabel testcase pada UI

### Requirement: Generate Test Cases from Requirements
Sistem HARUS menghasilkan test case berdasarkan input teks requirement.

#### Scenario: Generate BVA/EQP/DT
- GIVEN pengguna telah memilih tipe test (misal: BVA)
- WHEN pengguna menginput deskripsi requirement fitur
- THEN sistem menggunakan Gemini API untuk menganalisis batasan (boundaries) atau partisi logis
- AND menampilkan daftar test case di antarmuka Next.js

### Requirement: Export Functionality
- Sistem HARUS menyediakan fitur ekspor hasil test case ke format CSV atau PDF.

### Requirement: Save Requirements History
Sistem MUST menyimpan deskripsi requirement dan hasil generasi test cases ke dalam database yang tertaut pada ID percakapan.

#### Scenario: Archiving blackbox session
- **WHEN** pengguna menekan tombol "Generate Test Cases" pada halaman Blackbox
- **THEN** sistem SHALL mengirimkan teks requirement beserta `conversationId` ke backend
- **THEN** sistem SHALL menyimpan data tersebut sebagai payload `TestCase` yang tertaut pada percakapan tersebut

### Requirement: Restore Blackbox Session
Sistem MUST memulihkan requirement dan hasil test cases terakhir ketika sebuah sesi Blackbox dipilih dari riwayat.

#### Scenario: Opening past blackbox chat
- **WHEN** pengguna memilih riwayat chat yang merupakan sesi Blackbox
- **THEN** sistem SHALL melakukan navigasi ke halaman `/dashboard/blackbox`
- **THEN** sistem SHALL memuat payload `TestCase` terakhir untuk mengisi input requirement dan tabel hasil generasi