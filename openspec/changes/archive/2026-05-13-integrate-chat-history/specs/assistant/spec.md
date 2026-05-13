## ADDED Requirements

### Requirement: Restore Conversation History
Sistem MUST memuat kembali seluruh riwayat pesan ketika sebuah percakapan aktif dipilih dari riwayat chat.

#### Scenario: Switching to a previous conversation
- **WHEN** pengguna memilih sebuah percakapan lama dari sidebar
- **THEN** sistem SHALL memanggil endpoint `/api/conversations/:id` untuk mengambil riwayat pesan
- **THEN** sistem SHALL menampilkan seluruh riwayat pesan tersebut pada chat interface
