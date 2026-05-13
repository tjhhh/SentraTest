## 1. Directory Cleanup & Routing

- [x] 1.1 Pindahkan seluruh konten dari `frontend/src/app/(dashboard)` ke `frontend/src/app/dashboard`.
- [x] 1.2 Hapus folder `frontend/src/app/(dashboard)` setelah pemindahan selesai.
- [x] 1.3 Update path import di seluruh file frontend yang terdampak oleh pemindahan folder dashboard.
- [x] 1.4 Verifikasi navigasi dasar dashboard tetap berfungsi setelah restrukturisasi.

## 2. Backend API Enhancement

- [x] 2.1 Tambahkan endpoint `GET /api/wb/history/:conversationId` untuk mengambil test case whitebox terakhir dalam percakapan.
- [x] 2.2 Tambahkan endpoint `GET /api/bb/history/:conversationId` untuk mengambil test case blackbox terakhir dalam percakapan.
- [x] 2.3 Update service `analyze` di `whitebox.service.js` agar menyimpan `logicCode` dan `uiCode` ke dalam payload `TestCase`.
- [x] 2.4 Update service blackbox agar menyimpan input `requirement` ke dalam database.

## 3. Sidebar Logic Enhancement

- [x] 3.1 Modifikasi `Sidebar.tsx` agar fungsi `onClick` pada conversation item melakukan navigasi ke URL yang tepat.
- [x] 3.2 Implementasi logika deteksi tipe di Sidebar: jika percakapan memiliki test case, arahkan ke tool yang sesuai, jika tidak arahkan ke `/dashboard/assistant`.
- [x] 3.3 Pastikan `setActiveConversation` dipanggil sebelum navigasi untuk memicu pemuatan data di halaman tujuan.

## 4. Reactive Tool Pages

- [x] 4.1 Update `frontend/src/app/dashboard/assistant/page.tsx` agar secara otomatis memuat pesan saat `activeConversation` berubah.
- [x] 4.2 Update `frontend/src/app/dashboard/whitebox/page.tsx` untuk memanggil API history dan mengisi editor saat chat riwayat dipilih.
- [x] 4.3 Update `frontend/src/app/dashboard/blackbox/page.tsx` untuk memulihkan requirement dan tabel hasil dari database.
- [x] 4.4 Pastikan tombol "New Conversation" di Sidebar mereset state di seluruh halaman tool.
