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

### Requirement: Bug Explainer
Sistem HARUS bisa menjelaskan pesan error dari terminal/log melalui endpoint backend yang terintegrasi dengan AI service dan memberikan rekomendasi perbaikan.

#### Scenario: Error Analysis
- **WHEN** pengguna mengirim stack trace ke endpoint bug explain
- **THEN** sistem SHALL menganalisis error tersebut
- **THEN** sistem SHALL mengembalikan kemungkinan penyebab dan saran perbaikan yang dapat ditindaklanjuti
