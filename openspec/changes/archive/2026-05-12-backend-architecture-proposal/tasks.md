## 1. Foundation & Project Setup

- [x] 1.1 Inisialisasi struktur backend modular di `backend/src` (`modules`, `routes`, `services`, `repositories`, `middlewares`, `utils`, `prompts`, `config`).
- [x] 1.2 Tambahkan konfigurasi environment dan config loader terpusat (validasi variabel wajib, fallback aman).
- [x] 1.3 Pasang dependensi inti backend: Express, Prisma, PostgreSQL driver, JWT, bcrypt, Zod, rate limiter, CORS, dan util logging.
- [x] 1.4 Siapkan error handling global, response formatter, dan standar middleware chain.

## 2. Data Layer (Prisma + PostgreSQL)

- [x] 2.1 Definisikan Prisma schema untuk tabel `users`, `conversations`, `messages`, `test_cases`, `exports`, dan `bug_reports` beserta relasinya.
- [x] 2.2 Buat migration awal dan seed minimal untuk validasi alur development.
- [x] 2.3 Implementasikan repository pattern untuk akses data domain auth, conversation/message, testcase, export, dan bug report.

## 3. Security Baseline

- [x] 3.1 Implementasikan auth middleware JWT untuk protected endpoints.
- [x] 3.2 Implementasikan register/login dengan bcrypt hashing dan penerbitan access token + refresh token.
- [x] 3.3 Implementasikan refresh token lifecycle (refresh, rotation, revoke saat logout).
- [x] 3.4 Terapkan Zod input validation pada endpoint kritikal.
- [x] 3.5 Terapkan rate limiting pada endpoint auth/chat/generation serta konfigurasi CORS whitelist.

## 4. Core Modules - Conversation & Chat

- [x] 4.1 Implementasikan endpoint conversation (`GET /api/conversations`, `POST /api/conversations`) dan operasi rename/delete.
- [x] 4.2 Implementasikan endpoint message history (`GET /api/messages/:conversationId`) dengan kontrol ownership.
- [x] 4.3 Implementasikan AI chat endpoint (`POST /api/chat`) dengan context conversation.
- [x] 4.4 Implementasikan endpoint histori chat (`GET /api/chat/history`).

## 5. AI Integration Layer & Prompt Orchestrator

- [x] 5.1 Buat layanan Gemini terpusat di `services/ai` untuk pemanggilan model, context injection, dan parsing respons.
- [x] 5.2 Implementasikan prompt orchestrator untuk black-box (BVA/EQP/Decision Table) dan white-box coverage (statement/branch/path).
- [x] 5.3 Tambahkan guardrail parsing output AI ke format terstruktur yang dapat dipersistenkan.
- [x] 5.4 Tambahkan observability minimal (request id, latency, error categorization) untuk call AI.

## 6. Generator Modules (Black Box & White Box)

- [x] 6.1 Implementasikan endpoint black-box generate (`POST /api/bb/generate`) untuk testcase BVA/EQP/DT.
- [x] 6.2 Implementasikan endpoint black-box script (`POST /api/bb/script`) untuk generasi Playwright script.
- [x] 6.3 Implementasikan endpoint black-box export (`POST /api/bb/export`) dan penyimpanan metadata export.
- [x] 6.4 Implementasikan endpoint white-box analyze (`POST /api/wb/analyze`) untuk analisis coverage.
- [x] 6.5 Implementasikan endpoint white-box script (`POST /api/wb/script`) untuk generasi Playwright script dari hasil analisis.

## 7. Bug Explainer & Export Modules

- [x] 7.1 Implementasikan endpoint bug explainer (`POST /api/bug/explain`) untuk analisis stack trace dan saran solusi.
- [x] 7.2 Implementasikan export service lintas format (`POST /api/export/pdf`, `POST /api/export/zip`) termasuk dukungan JSON dan DOCX.
- [x] 7.3 Tambahkan storage metadata export dan bug report untuk auditability histori.

## 8. Realtime SSE

- [x] 8.1 Implementasikan SSE endpoint untuk streaming respons AI pada flow chat.
- [x] 8.2 Implementasikan realtime event untuk update pesan conversation tanpa polling.
- [x] 8.3 Tambahkan mekanisme heartbeat, reconnection hint, dan penutupan stream yang eksplisit.

## 9. Deployment Readiness

- [x] 9.1 Buat Dockerfile backend production-ready dengan multi-stage build.
- [x] 9.2 Sesuaikan `docker-compose.yaml` untuk integrasi backend + database lokal.
- [x] 9.3 Buat manifest Kubernetes baseline (Deployment, Service, ConfigMap/Secret reference).
- [x] 9.4 Siapkan struktur environment per stage (dev/test/prod) dan dokumentasi variabel.

## 10. Validation & CI/CD Readiness

- [x] 10.1 Tambahkan unit/integration test minimum untuk auth, conversation, chat, generator, dan bug explainer.
- [x] 10.2 Tambahkan contract test untuk endpoint utama dan format output AI parser.
- [x] 10.3 Tambahkan lint/typecheck/test script yang siap dieksekusi di pipeline CI.
- [x] 10.4 Lakukan smoke test end-to-end: auth -> chat -> generate testcase -> generate script -> export.
