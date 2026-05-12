## ADDED Requirements

### Requirement: Save Requirements History
Sistem MUST menyimpan deskripsi requirement dan hasil generasi test cases ke dalam database yang tertaut pada ID percakapan.

#### Scenario: Archiving blackbox session
- **WHEN** pengguna menekan tombol "Generate Test Cases" pada halaman Blackbox
- **THEN** sistem SHALL mengirimkan teks requirement beserta `conversationId` ke backend
- **THEN** sistem SHALL menyimpan data tersebut sebagai payload `TestCase` yang tertaut pada percakapan tersebut

### Requirement: Restore Blackbox Session
Sistem MUST memulihkan requirement dan hasil test cases terakhir ketika sebuah sesi Blackbox dipilih dari riwayat.

#### Scenario: Opening past blackbox chat
- **WHEN** pengguna memilih riwayat chat yang merupakan sesi Blackbox
- **THEN** sistem SHALL melakukan navigasi ke halaman `/dashboard/blackbox`
- **THEN** sistem SHALL memuat payload `TestCase` terakhir untuk mengisi input requirement dan tabel hasil generasi
