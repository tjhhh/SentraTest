## ADDED Requirements

### Requirement: Interactive AI Chat Interface
Sistem MUST menyediakan antarmuka chat bergaya ChatGPT yang mendukung pesan teks dan rendering markdown.

#### Scenario: Send Chat Message
- **WHEN** pengguna mengirim pesan melalui input chat
- **THEN** sistem SHALL menampilkan pesan pengguna di UI secara instan
- **THEN** sistem SHALL memanggil endpoint `/api/chat` dengan payload yang sesuai

### Requirement: Realtime AI Response Streaming
Sistem MUST mendukung streaming respons AI menggunakan Server-Sent Events (SSE) agar jawaban muncul secara bertahap.

#### Scenario: Receive Streamed Chunk
- **WHEN** stream data dari backend diterima oleh frontend
- **THEN** sistem SHALL memperbarui konten pesan asisten secara reaktif untuk setiap chunk yang datang
- **THEN** sistem SHALL menggulir (scroll) tampilan ke bawah secara otomatis
