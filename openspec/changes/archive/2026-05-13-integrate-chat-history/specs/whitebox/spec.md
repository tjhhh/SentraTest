## ADDED Requirements

### Requirement: Persistent Session State
Sistem MUST menyimpan kode logic dan UI ke dalam database setiap kali pengguna melakukan analisis atau generasi skrip.

#### Scenario: Auto-saving code session
- **WHEN** pengguna menekan tombol "Generate Tests" pada halaman Whitebox
- **THEN** sistem SHALL mengirimkan `logicCode` dan `uiCode` beserta `conversationId` ke backend
- **THEN** sistem SHALL menyimpan data tersebut sebagai payload `TestCase` yang tertaut pada percakapan tersebut

### Requirement: Restore Whitebox Session
Sistem MUST memulihkan kode logic, UI, dan hasil tes terakhir ketika sebuah sesi Whitebox dipilih dari riwayat.

#### Scenario: Loading previous whitebox session
- **WHEN** pengguna memilih riwayat chat yang merupakan sesi Whitebox
- **THEN** sistem SHALL melakukan navigasi ke halaman `/dashboard/whitebox`
- **THEN** sistem SHALL memuat payload `TestCase` terakhir untuk mengisi editor logic, editor UI, dan tabel hasil tes
