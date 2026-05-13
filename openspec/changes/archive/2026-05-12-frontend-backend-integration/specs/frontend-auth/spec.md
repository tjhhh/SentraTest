## ADDED Requirements

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
