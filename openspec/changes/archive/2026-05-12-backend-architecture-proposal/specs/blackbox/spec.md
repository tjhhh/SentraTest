## MODIFIED Requirements

### Requirement: Black Box Test Selection Flow
Sistem HARUS memandu pengguna melalui alur pemilihan tipe pengujian Black Box via endpoint backend sebelum generasi testcase dilakukan.

#### Scenario: Selection Process
- **WHEN** pengguna memilih kategori Black Box testing
- **THEN** sistem SHALL menyediakan opsi metode BVA, EQP, dan Decision Table sebagai parameter generasi

### Requirement: Generate Test Cases from Requirements
Sistem HARUS menghasilkan test case berdasarkan input requirement dan metode terpilih melalui AI orchestration service.

#### Scenario: Generate BVA/EQP/DT
- **WHEN** pengguna mengirim requirement fitur dan metode BVA, EQP, atau Decision Table ke endpoint generate
- **THEN** sistem SHALL memproses prompt metodologi sesuai metode
- **THEN** sistem SHALL mengembalikan daftar testcase terstruktur yang dapat disimpan

### Requirement: Export Functionality
Sistem HARUS menyediakan fitur ekspor hasil test case dan script terkait melalui endpoint backend.

#### Scenario: Export generated testcases
- **WHEN** pengguna meminta export hasil black-box generation
- **THEN** sistem SHALL menghasilkan file export sesuai format yang diminta

## ADDED Requirements

### Requirement: Playwright Script Generation from Black Box Cases
Sistem MUST dapat menghasilkan script Playwright berdasarkan testcase black box yang telah digenerate.

#### Scenario: Generate Playwright script
- **WHEN** pengguna mengirim testcase black box untuk pembuatan script
- **THEN** sistem SHALL mengembalikan script Playwright yang siap dieksekusi
