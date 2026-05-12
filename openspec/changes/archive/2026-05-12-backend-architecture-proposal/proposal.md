## Why

Platform QA assistant membutuhkan backend yang terstruktur untuk mendukung alur AI test automation end-to-end, dari autentikasi pengguna sampai generasi test case dan script Playwright. Perubahan ini dibutuhkan sekarang agar kapabilitas black-box dan white-box testing dapat dikembangkan secara konsisten, aman, dan siap scale pada deployment container/Kubernetes.

## What Changes

- Menetapkan arsitektur backend modular berbasis Node.js, Express.js, PostgreSQL, Prisma ORM, dan service/repository pattern.
- Menambahkan modul inti: auth, conversations/messages, AI chat, black-box generator, white-box generator, bug explainer, dan export report.
- Menetapkan kontrak REST API endpoint untuk seluruh modul backend utama.
- Menambahkan AI integration layer terdedikasi untuk Gemini API (prompt orchestration, context injection, methodology injection, response parsing).
- Menambahkan dukungan Server-Sent Events (SSE) untuk streaming response AI dan realtime update chat.
- Menetapkan baseline keamanan backend: JWT access/refresh token, bcrypt hashing, rate limiting, validasi input Zod, dan CORS protection.
- Menetapkan baseline deployment dan operasional: Docker containerization, Kubernetes manifests, environment-based configuration, dan struktur CI/CD-ready.

## Capabilities

### New Capabilities
- `conversation-history`: Manajemen percakapan dan histori pesan (create/list/rename/delete conversation, get message history).
- `bug-explainer`: Analisis stack trace dengan AI untuk penjelasan akar masalah dan rekomendasi perbaikan.
- `report-export`: Ekspor hasil pengujian ke PDF, DOCX, JSON, dan ZIP proyek Playwright.
- `ai-streaming`: Streaming response AI dan realtime chat updates berbasis SSE.
- `backend-platform`: Fondasi arsitektur modular backend, integrasi Prisma, dan deployment-ready runtime.

### Modified Capabilities
- `assistant`: Requirement diperluas untuk backend AI chat berbasis konteks percakapan dan streaming response.
- `auth`: Requirement diperluas untuk JWT access/refresh token flow serta penguatan kontrol keamanan endpoint.
- `blackbox`: Requirement diperluas untuk dukungan endpoint backend generasi test case (BVA/EQP/Decision Table), script Playwright, dan export.
- `whitebox`: Requirement diperluas untuk endpoint analisis coverage, generasi testcase, dan script Playwright.
- `system`: Requirement diperluas untuk deployment backend (Docker/Kubernetes), environment configuration, dan kesiapan operasional.

## Impact

- Backend codebase: penambahan struktur folder dan modul di `backend/src` untuk routes, controllers, services, repositories, middlewares, prompts, config, dan utils.
- API surface: penambahan endpoint baru untuk auth, conversations/messages, chat, black-box, white-box, bug explain, dan export.
- Data model: penambahan/normalisasi tabel Prisma (`users`, `conversations`, `messages`, `test_cases`, `exports`, `bug_reports`).
- Integrasi eksternal: dependensi Gemini API untuk inferensi AI dan orkestrasi prompt.
- Runtime/infrastruktur: penambahan SSE channel, Dockerfile/compose alignment, dan Kubernetes manifests baseline.
