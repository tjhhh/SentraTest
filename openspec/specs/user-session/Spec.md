# Domain: User & Session Management

## Requirements

### Requirement: User Profile Management
Sistem HARUS menyediakan fitur pengelolaan profil pengguna.

#### Scenario: View User Profile
- GIVEN pengguna yang sudah login
- WHEN pengguna mengakses halaman profil
- THEN sistem menampilkan informasi profil (username, email, tanggal registrasi)
- AND sistem menampilkan statistik penggunaan (jumlah test case yang dibuat, sesi chat)

#### Scenario: Update User Profile
- GIVEN pengguna yang sudah login
- WHEN pengguna mengupdate informasi profil (username, email)
- THEN sistem memvalidasi data yang diupdate
- AND sistem menyimpan perubahan ke database
- AND sistem menampilkan konfirmasi "Profil berhasil diupdate"

### Requirement: Session Management
Sistem HARUS menyediakan pengelolaan sesi pengguna yang komprehensif.

#### Scenario: View Active Sessions
- GIVEN pengguna yang login dari multiple devices
- WHEN pengguna mengakses halaman "Active Sessions"
- THEN sistem menampilkan daftar semua sesi aktif (device, location, last active time)
- AND sistem menandai sesi saat ini sebagai "Current Session"

#### Scenario: Terminate Specific Session
- GIVEN pengguna dengan multiple sesi aktif
- WHEN pengguna memilih untuk logout dari sesi tertentu
- THEN sistem menginvalidate refresh token untuk sesi tersebut
- AND sesi tersebut dihapus dari daftar active sessions
- AND sesi lain tetap aktif

#### Scenario: Role Management
- GIVEN administrator sistem
- WHEN administrator mengelola role pengguna
- THEN sistem menyediakan role-based access control (User, Admin)
- AND sistem membatasi akses fitur berdasarkan role