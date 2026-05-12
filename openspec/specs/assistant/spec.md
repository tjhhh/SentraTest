# Domain: Contextual Assistant (Chatbox)

## Requirements

### Requirement: Contextual Q&A
Sistem HARUS menyediakan antarmuka chat berbasis backend API yang memiliki konteks terhadap test case dan histori conversation aktif, serta mendukung mode streaming response.

#### Scenario: Asking about Test Case
- **WHEN** pengguna sedang berada pada conversation yang terkait test case dan mengajukan pertanyaan lanjutan
- **THEN** sistem SHALL menggabungkan konteks test case dan histori pesan untuk menghasilkan jawaban yang relevan

#### Scenario: Streaming assistant answer
- **WHEN** pengguna meminta respons assistant dengan mode streaming
- **THEN** sistem SHALL mengirim jawaban secara bertahap melalui SSE hingga respons selesai

### Requirement: Interactive AI Chat Interface
Sistem MUST menyediakan antarmuka chat bergaya ChatGPT yang mendukung pesan teks dan rendering markdown.

#### Scenario: Send Chat Message
- **WHEN** pengguna mengetik pesan dan menekan enter atau tombol kirim
- **THEN** sistem SHALL menampilkan pesan pengguna di UI
- **THEN** sistem SHALL memanggil endpoint `/api/chat` menggunakan SSE
- **THEN** sistem SHALL menampilkan balasan AI secara streaming (chunk-by-chunk)

### Requirement: Realtime AI Response Streaming
Sistem MUST mendukung pemrosesan stream data dari backend untuk memberikan feedback instan kepada pengguna.

#### Scenario: Process Streaming Chunk
- **WHEN** sistem menerima chunk data teks dari stream
- **THEN** sistem SHALL melakukan append teks tersebut ke pesan AI yang sedang aktif di UI
- **THEN** sistem SHALL melakukan auto-scroll ke bawah jika pengguna berada di posisi terbawah

### Requirement: Bug Explainer
Sistem HARUS bisa menjelaskan pesan error dari terminal/log melalui endpoint backend yang terintegrasi dengan AI service dan memberikan rekomendasi perbaikan.

#### Scenario: Error Analysis
- **WHEN** pengguna mengirim stack trace ke endpoint bug explain
- **THEN** sistem SHALL menganalisis error tersebut
- **THEN** sistem SHALL mengembalikan kemungkinan penyebab dan saran perbaikan yang dapat ditindaklanjuti
