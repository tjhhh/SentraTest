## Context

Fitur logout saat ini hanya melakukan pembersihan state lokal dan penghapusan cookie tanpa meminta konfirmasi dari pengguna. Selain itu, tidak ada pemanggilan ke backend untuk memberitahukan bahwa sesi telah berakhir (opsional, tapi disarankan). Pengguna membutuhkan verifikasi sebelum logout untuk menghindari klik yang tidak disengaja.

## Goals / Non-Goals

**Goals:**
- Menambahkan modal konfirmasi logout di UI.
- Memastikan pembersihan token dan state `authStore` berjalan sempurna.
- Mengintegrasikan proses logout dengan backend jika token refresh perlu diinvalidasi.
- Memberikan feedback error jika logout gagal.

**Non-Goals:**
- Implementasi sistem session timeout otomatis.
- Perbaikan fitur profil pengguna atau pengaturan lainnya.

## Decisions

1. **Modal Konfirmasi Berbasis State Lokal di Sidebar**:
   - **Rencana**: Menggunakan state `isLogoutModalOpen` di dalam `Sidebar.tsx` untuk mengontrol tampilan modal.
   - **Rasional**: Logout saat ini dipicu dari Sidebar, sehingga mengelola modal di sana adalah yang paling sederhana dan langsung.
   - **Alternatif**: Membuat komponen Modal global. (Terlalu kompleks untuk scope perbaikan kecil ini, tapi bisa dipertimbangkan jika ada banyak modal lain).

2. **Update `authStore` untuk Mendukung Async Logout**:
   - **Rencana**: Mengubah fungsi `logout` di `useAuthStore` menjadi asynchronous dan memanggil `authService.logout`.
   - **Rasional**: Memastikan backend juga membersihkan sesi/token refresh meningkatkan keamanan.
   - **Alternatif**: Hanya membersihkan state lokal (seperti sekarang). (Kurang aman karena refresh token tetap aktif di backend).

3. **Redirect Menggunakan `router.push` dari Next.js**:
   - **Rencana**: Setelah `authStore.logout()` berhasil, gunakan `useRouter` untuk mengarahkan user ke `/auth/login`.
   - **Rasional**: Memberikan transisi halaman yang mulus.

## Risks / Trade-offs

- **[Risk]** → Backend logout endpoint gagal atau lambat.
- **[Mitigation]** → Tambahkan timeout dan pastikan state lokal tetap dibersihkan meskipun request backend gagal (fail-safe).
- **[Risk]** → Pengguna menutup browser sebelum modal konfirmasi muncul.
- **[Mitigation]** → Ini perilaku standar, logout hanya terjadi jika dikonfirmasi.

## Migration Plan

Tidak ada migrasi database yang diperlukan. Perubahan hanya pada sisi frontend dan integrasi API yang sudah ada.
