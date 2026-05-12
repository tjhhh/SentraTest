## Why

Fitur "Recent Chat" di sidebar saat ini hanya berfungsi secara visual; mengeklik percakapan lama tidak memuat ulang data atau mengarahkan pengguna ke alat (tool) yang sesuai. Perubahan ini bertujuan untuk mengintegrasikan riwayat percakapan dengan halaman tool sehingga pengguna dapat melanjutkan sesi pengetesan sebelumnya dengan lancar.

## What Changes

- **Penyatuan Struktur Dashboard**: Menghapus folder `/(dashboard)` yang redundan dan memusatkan semua halaman dashboard di bawah `/dashboard`.
- **Navigasi Sidebar fungsional**: Mengupdate `Sidebar.tsx` agar mengeklik chat riwayat memicu navigasi ke tool yang relevan (Whitebox/Blackbox/Assistant).
- **Halaman Tool Reaktif**: Memodifikasi halaman `Whitebox`, `Blackbox`, dan `Assistant` agar secara otomatis memuat data (kode, requirement, pesan) berdasarkan `activeConversation`.
- **Linkage Data Backend**: Memperbarui API request agar menyertakan `conversationId` sehingga hasil analisis AI tersimpan secara permanen dalam riwayat.

## Capabilities

### New Capabilities
- (None)

### Modified Capabilities
- `assistant`: Menambahkan kemampuan untuk memuat riwayat pesan saat percakapan dipilih.
- `whitebox`: Menambahkan kemampuan untuk menyimpan dan memuat kembali kode logic, UI, dan hasil tes berdasarkan ID percakapan.
- `blackbox`: Menambahkan kemampuan untuk menyimpan requirement dan hasil generate test cases ke dalam riwayat percakapan.

## Impact

- **Frontend**: `Sidebar.tsx`, `whitebox/page.tsx`, `blackbox/page.tsx`, `assistant/page.tsx`, `conversationStore.ts`.
- **Backend**: `whitebox.service.js`, `blackbox.service.js`, API routes untuk Whitebox dan Blackbox.
- **Database**: Memastikan relasi antara `TestCase` dan `Conversation` digunakan secara konsisten.
