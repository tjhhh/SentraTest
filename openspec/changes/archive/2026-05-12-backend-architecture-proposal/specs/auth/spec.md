## MODIFIED Requirements

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

## ADDED Requirements

### Requirement: Refresh Token Lifecycle
Sistem MUST menyediakan endpoint dan mekanisme untuk refresh token rotation dan invalidasi sesi.

#### Scenario: Refresh access token
- **WHEN** pengguna mengirim refresh token yang valid
- **THEN** sistem SHALL menerbitkan access token baru dan refresh token baru

#### Scenario: Revoke refresh token
- **WHEN** pengguna logout atau token dicurigai disalahgunakan
- **THEN** sistem SHALL menonaktifkan refresh token sehingga tidak dapat digunakan kembali
