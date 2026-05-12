# Domain: Black-Box Test Case Generator

## Requirements

### Requirement: BVA (Boundary Value Analysis) Generator
Sistem HARUS menghasilkan test case menggunakan metode Boundary Value Analysis.

#### Scenario: Generate BVA Test Cases from Feature Description
- GIVEN QA engineer yang memasukkan deskripsi fitur dengan input fields dan constraints
- WHEN pengguna memilih metode BVA dan submit
- THEN sistem mengirim input ke Gemini AI dengan prompt template BVA
- AND AI mengidentifikasi nilai batas (minimum, maksimum, tepat di batas) untuk setiap input
- AND sistem menghasilkan minimal 10 test case dengan format lengkap (ID, Judul, Precondition, Langkah, Expected Result)
- AND setiap test case diklasifikasikan sebagai Positive, Negative, atau Edge Case
- AND sistem menyimpan hasil ke database dalam waktu < 30 detik

#### Scenario: BVA for Numeric Input Field
- GIVEN input field dengan range 1-100
- WHEN sistem generate BVA test cases
- THEN sistem menghasilkan test case untuk nilai: 0, 1, 2, 99, 100, 101
- AND test case mencakup valid boundary (1, 100) dan invalid boundary (0, 101)

#### Scenario: BVA for String Length
- GIVEN input field dengan constraint panjang 5-20 karakter
- WHEN sistem generate BVA test cases
- THEN sistem menghasilkan test case untuk panjang: 4, 5, 6, 19, 20, 21 karakter
- AND test case mencakup edge cases untuk string length

### Requirement: ECP (Equivalence Class Partitioning) Generator
Sistem HARUS menghasilkan test case menggunakan metode Equivalence Class Partitioning.

#### Scenario: Generate ECP Test Cases
- GIVEN pengguna memasukkan spesifikasi form dengan berbagai tipe input
- WHEN pengguna memilih metode ECP
- THEN sistem membagi domain input menjadi kelas ekivalensi valid dan invalid
- AND sistem menghasilkan minimal 1 test case per equivalence class
- AND sistem mengurangi jumlah test case yang redundant
- AND coverage pengujian tetap optimal

#### Scenario: ECP for Dropdown Selection
- GIVEN dropdown dengan 10 pilihan
- WHEN sistem generate ECP test cases
- THEN sistem mengidentifikasi valid equivalence class (semua pilihan valid)
- AND invalid equivalence class (tidak memilih, input tidak valid)
- AND sistem generate representative test case untuk setiap class

#### Scenario: ECP for Date Input
- GIVEN input field tanggal dengan format DD/MM/YYYY
- WHEN sistem generate ECP test cases
- THEN sistem mengidentifikasi valid class (tanggal valid)
- AND invalid class (format salah, tanggal tidak ada, bulan tidak valid)
- AND sistem generate test case untuk setiap class

### Requirement: Decision Table Testing Generator
Sistem HARUS menghasilkan test case menggunakan metode Decision Table.

#### Scenario: Generate Decision Table Test Cases
- GIVEN pengguna memasukkan kombinasi kondisi dan aksi yang kompleks
- WHEN pengguna memilih metode Decision Table
- THEN sistem menganalisis semua kombinasi kondisi yang mungkin
- AND sistem mengidentifikasi rules yang berbeda
- AND sistem menghasilkan test case untuk setiap rule dalam decision table
- AND sistem memastikan semua kombinasi kondisi tercakup

#### Scenario: Decision Table for Login Logic
- GIVEN kondisi: username valid/invalid, password valid/invalid, account locked/unlocked
- WHEN sistem generate decision table
- THEN sistem mengidentifikasi 2^3 = 8 kombinasi kondisi
- AND sistem generate test case untuk setiap kombinasi
- AND expected result berbeda untuk setiap rule

#### Scenario: Decision Table Optimization
- GIVEN decision table dengan kondisi yang redundant
- WHEN sistem menganalisis decision table
- THEN sistem mengidentifikasi dan menggabungkan rules yang equivalent
- AND jumlah test case diminimalkan tanpa mengurangi coverage

### Requirement: Test Case Management
Sistem HARUS menyediakan fitur pengelolaan test case yang dihasilkan.

#### Scenario: View Generated Test Cases
- GIVEN pengguna yang telah generate test case
- WHEN pengguna mengakses halaman hasil
- THEN sistem menampilkan test case dalam tabel interaktif
- AND kolom mencakup: ID (TC-[MODUL]-[NOMOR]), Judul, Tipe, Prioritas, Metode
- AND pengguna dapat sort dan filter test case

#### Scenario: Edit Test Case
- GIVEN test case yang telah dihasilkan
- WHEN pengguna mengedit langkah atau expected result
- THEN sistem menyimpan perubahan ke database
- AND sistem menandai test case sebagai "modified"
- AND perubahan tersimpan untuk ekspor selanjutnya

#### Scenario: Delete Test Case
- GIVEN test case yang tidak diperlukan
- WHEN pengguna memilih untuk menghapus test case
- THEN sistem menghapus test case dari database
- AND sistem menampilkan konfirmasi sebelum hapus

### Requirement: Input Validation
Sistem HARUS memvalidasi input sebelum generate test case.

#### Scenario: Input Feature Description
- GIVEN pengguna memasukkan deskripsi fitur dalam bahasa natural
- WHEN deskripsi minimal 50 karakter dan maksimal 5000 karakter
- THEN sistem menerima input
- AND sistem mengirim ke AI untuk diproses

#### Scenario: Input with Insufficient Detail
- GIVEN pengguna memasukkan deskripsi terlalu singkat (< 50 karakter)
- WHEN sistem memvalidasi input
- THEN sistem menolak dan menampilkan pesan "Deskripsi terlalu singkat, mohon berikan detail yang cukup"

#### Scenario: Upload Source Code (Optional)
- GIVEN pengguna ingin generate test case dengan konteks kode
- WHEN pengguna upload file source code (format: .js, .py, .java, .ts)
- THEN sistem memvalidasi file type dan size (max 5MB)
- AND sistem membaca kode sebagai konteks tambahan untuk AI