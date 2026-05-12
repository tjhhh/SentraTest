# Domain: Authentication

## Requirements

### Requirement: User Authentication
Sistem HARUS menyediakan mekanisme bagi pengguna untuk mendaftar dan masuk ke dalam aplikasi menggunakan kredensial tervalidasi, password hashing bcrypt, dan JWT access token.

#### Scenario: User Registration
- **WHEN** pengguna baru mengirim email dan password valid untuk registrasi
- **THEN** sistem SHALL melakukan hash password sebelum penyimpanan ke database PostgreSQL
- **THEN** sistem SHALL membuat akun pengguna dan mengembalikan access token serta refresh token

#### Scenario: User Login
- **WHEN** pengguna terdaftar memasukkan email dan kredensial valid
- **THEN** sistem SHALL memvalidasi kredensial terhadap hash password tersimpan
- **THEN** sistem SHALL mengembalikan access token dan refresh token yang aktif

### Requirement: Refresh Token Lifecycle
Sistem MUST menyediakan endpoint dan mekanisme untuk refresh token rotation dan invalidasi sesi.

#### Scenario: Refresh access token
- **WHEN** pengguna mengirim refresh token yang valid
- **THEN** sistem SHALL menerbitkan access token baru dan refresh token baru

#### Scenario: Revoke refresh token
- **WHEN** pengguna logout atau token dicurigai disalahgunakan
- **THEN** sistem SHALL menonaktifkan refresh token sehingga tidak dapat digunakan kembali

### Requirement: JWT-based Authentication Flow
Sistem MUST menghubungkan form login dan registrasi dengan endpoint backend `/api/auth` dan mengelola token JWT.

#### Scenario: Successful Login
- **WHEN** pengguna memasukkan kredensial yang valid dan menekan tombol login
- **THEN** sistem SHALL memanggil endpoint `/api/auth/login`
- **THEN** sistem SHALL menyimpan access token dan refresh token secara aman
- **THEN** sistem SHALL mengarahkan pengguna ke dashboard utama

### Requirement: Protected Route Management
Sistem MUST membatasi akses ke halaman internal platform hanya untuk pengguna yang telah terautentikasi.

#### Scenario: Unauthenticated Access
- **WHEN** pengguna yang tidak terautentikasi mencoba mengakses URL `/dashboard` atau `/chat`
- **THEN** sistem SHALL mengarahkan pengguna kembali ke halaman login secara otomatis
