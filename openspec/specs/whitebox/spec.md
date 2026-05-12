# Domain: White Box Generator

## 1. Requirements

### Requirement: Code-Based Test Generation
Sistem HARUS mampu memproses potongan kode untuk menghasilkan test case berdasarkan struktur internal kode.

#### Scenario: Selection & Generation
- *GIVEN* pengguna memilih tipe coverage (Statement, Branch, atau Path).
- *WHEN* pengguna menginput potongan kode JavaScript/Node.js.
- *THEN* sistem menggunakan Gemini API untuk menghasilkan skenario pengujian yang memenuhi kriteria coverage tersebut.

### Requirement: Playwright Script Generation
Sistem HARUS menghasilkan script automation berbasis Playwright yang valid.

#### Scenario: Generate Automation Script
- *GIVEN* hasil pengujian whitebox telah tersedia.
- *WHEN* pengguna memicu aksi "Generate Script".
- *THEN* sistem menghasilkan file script Playwright (.spec.js) yang siap dieksekusi.

### Requirement: Remote Script Execution (Run on Web)
Sistem HARUS dapat mengeksekusi script Playwright yang dihasilkan dan menampilkan hasilnya secara real-time.

#### Scenario: Run Test & Show Output
- *GIVEN* script Playwright telah digenerate.
- *WHEN* pengguna menekan tombol "Run Test".
- *THEN* Backend (Express.js) mengeksekusi script tersebut menggunakan Playwright Runner di lingkungan terisolasi.
- *AND* sistem menangkap output konsol dan status akhir.
- *AND* Frontend (Next.js) menampilkan status "PASS" (hijau) atau "FAIL" (merah) beserta log detailnya.