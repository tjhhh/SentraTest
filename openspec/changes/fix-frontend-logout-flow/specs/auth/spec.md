## ADDED Requirements

### Requirement: Secure Logout with User Confirmation
Sistem MUST menyediakan mekanisme logout yang aman yang melibatkan konfirmasi eksplisit dari pengguna sebelum sesi diakhiri dan state dibersihkan.

#### Scenario: Successful Logout with Confirmation
- **WHEN** pengguna mengklik tombol logout dan mengonfirmasi pada modal verifikasi
- **THEN** sistem SHALL memanggil endpoint logout (jika tersedia) atau langsung membersihkan token dari local storage/cookie
- **THEN** sistem SHALL mereset `authStore` ke keadaan awal
- **THEN** sistem SHALL mengarahkan pengguna kembali ke halaman login

#### Scenario: Cancel Logout
- **WHEN** pengguna mengklik tombol logout tetapi memilih "Batal" pada modal verifikasi
- **THEN** sistem SHALL menutup modal tanpa mengubah status autentikasi atau membersihkan state
