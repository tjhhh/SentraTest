## Context

Backend saat ini membutuhkan fondasi arsitektur yang konsisten untuk mengakomodasi use case AI test automation: auth, chat kontekstual, black-box/white-box generation, bug explanation, serta export report. Lingkup perubahan bersifat lintas modul dan lintas concern (security, data model, streaming realtime, integrasi AI, dan deployment), sehingga membutuhkan desain teknis eksplisit sebelum implementasi.

Kendala utama:
- Integrasi AI harus tetap deterministik pada level format output agar aman untuk dipakai generator testcase dan script.
- Respons AI perlu streaming agar UX chat terasa realtime.
- Endpoint backend harus aman dan siap scale pada deployment container/Kubernetes.

Stakeholder utama: pengguna QA engineer, tim backend, tim frontend, dan tim DevOps.

## Goals / Non-Goals

**Goals:**
- Menyediakan arsitektur backend modular berbasis Express.js dengan service layer dan repository pattern.
- Menetapkan kontrak API untuk modul auth, conversation, chat, black-box, white-box, bug explainer, dan export.
- Menstandarkan integrasi Gemini API melalui AI integration layer dan prompt orchestrator.
- Menetapkan persistence model dengan Prisma + PostgreSQL untuk users, conversations, messages, test_cases, exports, bug_reports.
- Menyediakan streaming response AI dan realtime update chat dengan SSE.
- Menetapkan baseline keamanan (JWT access/refresh, bcrypt, rate limiting, Zod validation, CORS).
- Menyediakan struktur siap deploy (Docker, Kubernetes manifests, environment configuration).

**Non-Goals:**
- Implementasi UI frontend atau redesign pengalaman pengguna.
- Pemilihan cloud provider spesifik dan provisioning infrastruktur production penuh.
- Fine-tuning model AI atau training model kustom.
- Penyelesaian semua optimisasi performa tingkat lanjut (misal autoscaling policy detail, advanced caching).

## Decisions

1. Arsitektur modular per domain module
- Keputusan: gunakan struktur `modules/<domain>` dengan pemisahan controller, service, repository, routes.
- Rationale: meminimalkan coupling, memudahkan ownership tim, dan mempercepat pengujian per modul.
- Alternatif: struktur berbasis layer global tanpa domain split.
- Alasan tidak dipilih: sulit scale saat jumlah fitur bertambah dan rawan konflik perubahan lintas tim.

2. Service layer + repository pattern
- Keputusan: business rule berada di service; akses data di repository via Prisma client.
- Rationale: menjaga testability, separation of concerns, dan mengurangi kebocoran query di controller.
- Alternatif: controller langsung mengakses Prisma.
- Alasan tidak dipilih: menurunkan maintainability serta menyulitkan mocking dan refactor.

3. AI integration layer terpusat
- Keputusan: seluruh panggilan Gemini melewati `services/ai` dan `prompts` orchestrator.
- Rationale: konsistensi prompt, guardrail output parsing, dan reusable context injection.
- Alternatif: panggilan Gemini langsung dari tiap service domain.
- Alasan tidak dipilih: duplikasi logic prompt, inkonsistensi format output, dan sulit observability.

4. SSE untuk realtime AI/chat
- Keputusan: gunakan Server-Sent Events untuk streaming token/partial response dan event chat update.
- Rationale: sederhana untuk alur server-to-client, cocok untuk streaming satu arah, overhead rendah.
- Alternatif: WebSocket penuh.
- Alasan tidak dipilih: kompleksitas state connection lebih tinggi untuk kebutuhan saat ini.

5. Auth berbasis JWT access + refresh token
- Keputusan: access token pendek umur, refresh token terpisah dengan mekanisme rotasi/invalidasi.
- Rationale: meningkatkan keamanan sesi dan mendukung pengalaman login berkelanjutan.
- Alternatif: session server-side stateful.
- Alasan tidak dipilih: menambah kompleksitas penyimpanan session terpusat pada arsitektur target.

6. Validasi dan keamanan baseline wajib
- Keputusan: Zod untuk input validation, bcrypt untuk hash password, rate limiter global + endpoint sensitif, dan CORS whitelist.
- Rationale: menurunkan risiko abuse dan mencegah invalid payload sejak boundary API.
- Alternatif: validasi ad-hoc per endpoint.
- Alasan tidak dipilih: tidak konsisten, rawan celah, dan sulit diaudit.

7. Deployability-first
- Keputusan: menyediakan Dockerfile backend, `docker-compose` untuk local integration, serta manifest Kubernetes baseline.
- Rationale: mempercepat onboarding, parity environment, dan kesiapan CI/CD.
- Alternatif: hanya menjalankan local runtime tanpa container.
- Alasan tidak dipilih: environment drift tinggi dan sulit standarisasi pipeline.

## Risks / Trade-offs

- [Variasi output AI menyebabkan format testcase tidak konsisten] -> Mitigasi: schema-based response parsing dan fallback prompt repair pada orchestrator.
- [SSE connection drop saat traffic tinggi] -> Mitigasi: heartbeat event, retry policy client, dan timeout handling server.
- [Kenaikan latensi karena chaining orchestration + parsing] -> Mitigasi: prompt template ringkas, caching konteks percakapan, dan logging bottleneck.
- [Kompleksitas modul meningkat saat semua domain aktif] -> Mitigasi: contract test per endpoint, boundary linting, dan standar coding per module.
- [Risiko keamanan token refresh] -> Mitigasi: token rotation, revoke on logout, dan penyimpanan aman berbasis hash untuk refresh token.

## Migration Plan

1. Menetapkan struktur folder backend modular dan konfigurasi dasar (env, logger, error handler).
2. Menambahkan Prisma schema + migration untuk tabel inti.
3. Mengimplementasikan Auth module dan middleware keamanan lintas endpoint.
4. Mengimplementasikan Conversation + Messages module.
5. Menambahkan AI integration layer dan prompt orchestrator.
6. Mengimplementasikan Chat, Black-box, White-box, Bug Explainer, dan Export module.
7. Menambahkan SSE endpoint serta event payload contract.
8. Menyusun Dockerfile, compose integration, dan manifest Kubernetes baseline.
9. Menjalankan smoke test API, security checks dasar, dan validasi kontrak endpoint.

Rollback strategy:
- Gunakan release bertahap per modul dengan feature flags endpoint jika diperlukan.
- Rollback image container ke versi stabil sebelumnya.
- Rollback database melalui migration down terkontrol untuk perubahan yang reversibel.

## Open Questions

- Apakah refresh token disimpan hanya di database atau ditambah cache layer (Redis) untuk revocation lookup?
- Standar format output AI untuk test case/playwright apakah JSON-only atau kombinasi markdown+JSON?
- Batas rate limiting final per endpoint kritikal (auth/chat/generate) akan mengikuti kebutuhan produk atau baseline keamanan umum?
- Prioritas format export awal untuk fase implementasi pertama (PDF vs DOCX vs ZIP)?