## 1. Auth Store & Service Update

- [x] 1.1 Ubah fungsi `logout` di `authStore.ts` menjadi asynchronous.
- [x] 1.2 Integrasikan pemanggilan `authService.logout` di dalam `authStore.logout` menggunakan refresh token yang tersimpan.
- [x] 1.3 Pastikan state lokal (`user`, `token`, `refreshToken`) dan cookie dibersihkan baik request ke backend berhasil maupun gagal.

## 2. UI Implementation (Logout Modal)

- [x] 2.1 Tambahkan state `isLogoutModalOpen` di `Sidebar.tsx`.
- [x] 2.2 Buat komponen modal konfirmasi sederhana di dalam `Sidebar.tsx` atau sebagai komponen terpisah.
- [x] 2.3 Modal harus memiliki teks konfirmasi dan dua tombol: "Ya, Keluar" dan "Batal".
- [x] 2.4 Hubungkan tombol "Sign Out" yang sudah ada untuk membuka modal konfirmasi, bukan langsung memicu logout.

## 3. Logic Integration & Testing

- [x] 3.1 Implementasikan fungsi `handleConfirmLogout` di `Sidebar.tsx` yang memanggil `authStore.logout()` dan melakukan pengalihan halaman.

- [x] 3.2 Gunakan `useRouter` dari `next/navigation` untuk redirect ke `/auth/login`.
- [x] 3.3 Tambahkan notifikasi (toast) jika proses logout berhasil atau jika terjadi error yang perlu diketahui user.
- [x] 3.4 Verifikasi alur: Klik Logout -> Muncul Modal -> Klik Batal -> Modal Tertutup.
- [x] 3.5 Verifikasi alur: Klik Logout -> Muncul Modal -> Klik Ya -> Logout Berhasil -> Redirect ke Login.
