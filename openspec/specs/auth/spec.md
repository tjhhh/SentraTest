# Domain: Authentication

## Requirements

### Requirement: User Authentication
Sistem HARUS menyediakan mekanisme bagi pengguna untuk mendaftar dan masuk ke dalam aplikasi untuk mengelola proyek test case mereka.

#### Scenario: User Registration
- GIVEN pengguna baru yang belum memiliki akun
- WHEN pengguna mengisi form registrasi (email, password)
- THEN sistem menyimpan data pengguna ke database PostgreSQL
- AND sistem mengembalikan token sesi (JWT)

#### Scenario: User Login
- GIVEN pengguna yang sudah terdaftar
- WHEN pengguna memasukkan email dan kredensial yang valid
- THEN sistem memvalidasi kredensial
- AND memberikan akses ke dashboard utama