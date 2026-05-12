## ADDED Requirements

### Requirement: Conversation Lifecycle Management
Sistem MUST menyediakan API untuk membuat, mengambil daftar, mengganti nama, dan menghapus conversation per pengguna terautentikasi.

#### Scenario: Create conversation
- **WHEN** pengguna terautentikasi memanggil endpoint pembuatan conversation dengan payload valid
- **THEN** sistem SHALL membuat record conversation baru yang terasosiasi ke user

#### Scenario: Rename conversation
- **WHEN** pengguna pemilik conversation memanggil endpoint rename dengan nama baru yang valid
- **THEN** sistem SHALL memperbarui nama conversation tanpa mengubah histori pesan

#### Scenario: Delete conversation
- **WHEN** pengguna pemilik conversation menghapus conversation
- **THEN** sistem SHALL menghapus conversation beserta seluruh message terkait secara konsisten

### Requirement: Message History Retrieval
Sistem MUST menyimpan message user dan assistant pada setiap conversation dan menyediakan endpoint histori yang terurut kronologis.

#### Scenario: Save message
- **WHEN** pesan baru dikirim dalam conversation yang valid
- **THEN** sistem SHALL menyimpan pesan dengan metadata role, timestamp, dan relasi conversation

#### Scenario: Get message history
- **WHEN** pengguna memanggil endpoint histori untuk conversation miliknya
- **THEN** sistem SHALL mengembalikan daftar pesan terurut berdasarkan waktu pembuatan
