## Context

Sistem saat ini memiliki fungsionalitas Whitebox, Blackbox, dan AI Assistant, namun data sesi tersebut hilang saat halaman di-refresh atau berpindah tool. Tabel `Conversation`, `Message`, dan `TestCase` di database sudah ada, namun belum dihubungkan secara fungsional di UI untuk navigasi riwayat.

## Goals / Non-Goals

**Goals:**
- Mengarahkan pengguna ke halaman tool yang tepat saat mengeklik riwayat chat.
- Memulihkan state (kode logic, UI, requirement) di halaman tool tersebut.
- Menyimpan setiap aktivitas pengetesan ke dalam database yang tertaut ke ID percakapan.
- Menghapus folder dashboard ganda untuk menyederhanakan routing.

**Non-Goals:**
- Implementasi fitur kolaborasi real-time.
- Perubahan besar pada algoritma AI generation itu sendiri.

## Decisions

### 1. Navigasi Berbasis Tipe Konten
Sidebar akan mengecek `TestCase` pertama yang tertaut pada sebuah percakapan:
- Jika ada `TestCase` tipe `WHITEBOX` → Navigasi ke `/dashboard/whitebox`.
- Jika ada `TestCase` tipe `BLACKBOX` → Navigasi ke `/dashboard/blackbox`.
- Jika hanya ada pesan teks → Navigasi ke `/dashboard/assistant`.

### 2. Sinkronisasi State melalui activeConversation
Halaman tool akan menggunakan `useEffect` yang berlangganan pada `activeConversation` dari `useConversationStore`. Ketika `activeConversation` berubah:
- Halaman akan memanggil endpoint `GET /api/wb/history/:id` (atau sejenisnya) untuk mengambil payload `TestCase` terakhir.
- Mengisi editor dengan data dari payload tersebut.

### 3. Folder Dashboard Terpusat
Memindahkan konten dari `frontend/src/app/(dashboard)` ke `frontend/src/app/dashboard` dan menghapus folder `(dashboard)`. Ini akan memperbaiki inkonsistensi routing.

## Risks / Trade-offs

- **[Risk]** Data history yang lama mungkin tidak memiliki `conversationId` yang valid.
- **[Mitigation]** Memberikan fallback ke state default jika data tidak ditemukan atau format tidak sesuai.
- **[Trade-off]** Pemindahan folder dashboard mungkin memerlukan update path import di banyak tempat.
- **[Mitigation]** Gunakan find-and-replace massal dan pastikan `tsconfig.json` paths tetap valid.
