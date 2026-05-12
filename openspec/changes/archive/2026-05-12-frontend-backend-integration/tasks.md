## 1. Setup & Infrastructure

- [x] 1.1 Pasang dependensi: `zustand`, `lucide-react`, `react-markdown`, `remark-gfm`.
- [x] 1.2 Inisialisasi struktur folder baru: `services/`, `store/`, `hooks/`, `types/`.
- [x] 1.3 Siapkan base API service menggunakan Fetch dengan konfigurasi base URL dan interceptor token.

## 2. Authentication & State Management

- [x] 2.1 Buat `authStore` menggunakan Zustand untuk menyimpan user data dan token.
- [x] 2.2 Implementasikan `auth.service.ts` untuk memanggil endpoint login/register.
- [x] 2.3 Tambahkan Next.js middleware untuk proteksi route (redirect ke /login jika tidak ada token).
- [x] 2.4 Hubungkan form login/register yang sudah ada dengan `authStore` dan `auth.service`.

## 3. Sidebar & Conversation Management

- [x] 3.1 Buat `conversationStore` untuk mengelola daftar chat dan conversation aktif.
- [x] 3.2 Implementasikan `conversation.service.ts` untuk CRUD conversation.
- [x] 3.3 Hubungkan sidebar UI dengan `conversationStore` (fetch list, create new, delete).
- [x] 3.4 Implementasikan fitur rename conversation via UI sidebar.

## 4. AI Chat & SSE Streaming

- [x] 4.1 Implementasikan `chat.service.ts` yang mendukung pemanggilan SSE (Server-Sent Events).
- [x] 4.2 Buat `useChat` hook untuk mengelola logic pengiriman pesan dan pemrosesan chunk streaming.
- [x] 4.3 Integrasikan antarmuka chat dengan rendering markdown dan syntax highlighting untuk potongan kode.
- [x] 4.4 Pastikan state chat tersimpan secara lokal dan tersinkronisasi dengan backend.

## 5. Generator Modules & Export

- [x] 5.1 Implementasikan `bb.service.ts` untuk generator Black Box (generate, script, export).
- [x] 5.2 Implementasikan `wb.service.ts` untuk generator White Box (analyze, script).
- [x] 5.3 Implementasikan `bug.service.ts` untuk Bug Explainer.
- [x] 5.4 Hubungkan UI masing-masing generator dengan service dan tampilkan hasil (tabel/code block).
- [x] 5.5 Implementasikan utilitas pengunduhan file untuk fitur Export (PDF/JSON/ZIP).

## 6. UI Refinement & Verification

- [x] 6.1 Pastikan transisi antar halaman mulus dan responsif di berbagai ukuran layar.
- [x] 6.2 Implementasikan penanganan error global (toast notification) untuk kegagalan API/AI.
- [x] 6.3 Verifikasi alur end-to-end: login -> chat -> generate testcase -> export.
