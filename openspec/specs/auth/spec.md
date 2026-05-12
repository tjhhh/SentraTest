# Domain: Authentication

## Requirements

### Requirement: User Registration
Sistem HARUS menyediakan mekanisme pendaftaran akun bagi pengguna baru dengan validasi yang aman.

#### Scenario: Successful User Registration
- GIVEN pengguna baru yang belum memiliki akun
- WHEN pengguna mengisi form registrasi dengan email valid, username unik, dan password yang memenuhi kriteria kompleksitas
- THEN sistem memvalidasi input dan menyimpan data pengguna ke database PostgreSQL dengan password yang ter-hash menggunakan bcrypt
- AND sistem mengembalikan JWT token (access token 15 menit, refresh token 7 hari)
- AND pengguna diarahkan ke dashboard utama

#### Scenario: Registration with Invalid Email
- GIVEN pengguna mencoba mendaftar dengan format email tidak valid
- WHEN sistem melakukan validasi email
- THEN sistem menolak registrasi dan menampilkan pesan error "Email tidak valid"

#### Scenario: Registration with Duplicate Email
- GIVEN pengguna mencoba mendaftar dengan email yang sudah terdaftar
- WHEN sistem memeriksa keberadaan email di database
- THEN sistem menolak registrasi dan menampilkan pesan error "Email sudah terdaftar"

#### Scenario: Registration with Weak Password
- GIVEN pengguna mencoba mendaftar dengan password yang tidak memenuhi kriteria kompleksitas
- WHEN sistem memvalidasi strength password
- THEN sistem menolak registrasi dan menampilkan pesan error "Password terlalu lemah"

### Requirement: User Login
Sistem HARUS menyediakan mekanisme login yang aman dengan JWT authentication.

#### Scenario: Successful Login
- GIVEN pengguna yang sudah terdaftar dengan email dan password valid
- WHEN pengguna memasukkan kredensial yang benar
- THEN sistem memvalidasi kredensial dengan bcrypt
- AND sistem menghasilkan JWT token (access token dan refresh token)
- AND sistem menyimpan sesi login di database
- AND pengguna diarahkan ke dashboard utama

#### Scenario: Login with Invalid Credentials
- GIVEN pengguna mencoba login dengan email atau password yang salah
- WHEN sistem memvalidasi kredensial
- THEN sistem menolak login dan menampilkan pesan error "Email atau password salah"
- AND sistem mencatat attempt untuk proteksi brute force

#### Scenario: Login with Remember Me
- GIVEN pengguna memilih opsi "Remember Me" saat login
- WHEN login berhasil
- THEN refresh token disimpan dengan durasi lebih lama (7 hari)
- AND pengguna tetap login meskipun menutup browser

### Requirement: JWT Token Management
Sistem HARUS mengelola JWT token dengan mekanisme refresh token yang aman.

#### Scenario: Access Token Expiration
- GIVEN pengguna dengan access token yang expired (15 menit)
- WHEN pengguna mengakses protected endpoint
- THEN sistem mengembalikan error 401 Unauthorized
- AND sistem menyediakan mekanisme untuk refresh token

#### Scenario: Token Refresh
- GIVEN pengguna dengan refresh token yang masih valid
- WHEN access token expired dan pengguna meminta token baru
- THEN sistem memvalidasi refresh token
- AND sistem menghasilkan access token baru
- AND sistem mengembalikan token baru ke client

#### Scenario: Logout
- GIVEN pengguna yang sedang login
- WHEN pengguna melakukan logout
- THEN sistem menghapus token dari storage
- AND sistem menginvalidate refresh token di database
- AND pengguna diarahkan ke halaman login

### Requirement: Session Management
Sistem HARUS mengelola sesi pengguna dengan keamanan yang memadai.

#### Scenario: Multiple Device Login
- GIVEN pengguna login dari perangkat berbeda
- WHEN pengguna login di perangkat baru
- THEN sistem membuat sesi baru untuk perangkat tersebut
- AND sistem mencatat semua sesi aktif di database

#### Scenario: Logout from All Devices
- GIVEN pengguna dengan multiple sesi aktif
- WHEN pengguna memilih "Logout from all devices"
- THEN sistem menginvalidate semua refresh token pengguna
- AND semua sesi aktif terminated