## Why

Saat ini fitur logout pada frontend belum berfungsi dengan benar, tombol logout tidak menjalankan alur pembersihan sesi (token cleanup) dan tidak memberikan konfirmasi kepada pengguna. Hal ini menyebabkan risiko keamanan dan pengalaman pengguna yang kurang intuitif. Perbaikan ini diperlukan untuk memastikan sesi pengguna dapat diakhiri dengan aman dan terverifikasi.

## What Changes

- Menambahkan modal konfirmasi logout sebelum proses logout dijalankan.
- Mengimplementasikan logika logout pada `authStore` (Zustand) untuk membersihkan token dan data pengguna.
- Mengintegrasikan tombol logout dengan `auth.service` untuk menangani proses logout di sisi backend (jika diperlukan) dan frontend.
- Menambahkan penanganan error jika proses logout gagal.
- Memastikan pengalihan (redirect) otomatis ke halaman login setelah logout berhasil.

## Capabilities

### New Capabilities
- None

### Modified Capabilities
- `auth`: Menambahkan persyaratan untuk alur logout yang aman dengan konfirmasi pengguna dan pembersihan state di sisi klien.

## Impact

- `frontend/src/store/authStore.ts`: Update state management untuk pembersihan data.
- `frontend/src/services/auth.service.ts`: Update service untuk menangani request logout.
- `frontend/src/components/Sidebar.tsx` (atau lokasi tombol logout): Penambahan modal konfirmasi dan integrasi event handler.
- Middleware Next.js: Memastikan pengalihan ke halaman login bekerja dengan benar setelah token dihapus.
