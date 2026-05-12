## ADDED Requirements

### Requirement: Streaming AI Response over SSE
Sistem MUST menyediakan stream respons AI secara bertahap menggunakan Server-Sent Events.

#### Scenario: Stream partial response
- **WHEN** pengguna memulai request chat yang mendukung streaming
- **THEN** sistem SHALL mengirim event SSE secara incremental hingga respons lengkap diterima

#### Scenario: Stream completion event
- **WHEN** respons AI selesai diproses
- **THEN** sistem SHALL mengirim event final yang menandai akhir stream secara eksplisit

### Requirement: Realtime Chat Update Delivery
Sistem MUST mengirim update chat realtime yang relevan dengan conversation aktif pengguna.

#### Scenario: Emit new message event
- **WHEN** message baru tersimpan pada conversation yang aktif
- **THEN** sistem SHALL mem-publish event SSE agar klien memperbarui UI chat tanpa polling
