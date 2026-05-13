## Context

Integrasi ini menghubungkan frontend Next.js (App Router, Tailwind, TypeScript) dengan backend Express.js. Frontend sudah memiliki komponen UI dasar (shadcn/ui), namun belum memiliki logika fungsional untuk berkomunikasi dengan API backend, manajemen state aplikasi, atau penanganan respons streaming dari AI.

## Goals / Non-Goals

**Goals:**
- Implementasi arsitektur integrasi yang bersih dengan pemisahan antara layer UI, State, dan Service.
- Sinkronisasi status autentikasi JWT di seluruh aplikasi.
- Pengalaman pengguna "live" dengan streaming respons AI (SSE).
- Manajemen histori conversation yang persisten dan responsif.
- Dukungan penuh untuk alur generasi Black Box dan White Box.

**Non-Goals:**
- Refactor total komponen UI yang sudah ada (kecuali diperlukan untuk integrasi).
- Perubahan pada skema database atau endpoint backend.

## Decisions

1. **State Management: Zustand**
   - *Rationale*: Ringan, mudah digunakan dengan React hooks, dan memiliki boilerplate minimal dibandingkan Redux. Cocok untuk mengelola state global seperti auth, daftar conversation, dan data streaming.

2. **API Communication: Service Layer (Fetch API)**
   - *Rationale*: Menggunakan Fetch API bawaan untuk meminimalkan dependensi. Logika API dibungkus dalam `services/` untuk memudahkan pemeliharaan dan pengujian.

3. **Realtime Streaming: Server-Sent Events (SSE) Client**
   - *Rationale*: Sesuai dengan spesifikasi backend. Menggunakan `EventSource` API (atau wrapper jika perlu kontrol header Bearer) untuk menangani respons chunk-by-chunk dari Gemini.

4. **Middleware: Next.js Auth Guard**
   - *Rationale*: Memanfaatkan middleware Next.js untuk proteksi route di sisi server/client berdasarkan keberadaan token JWT di cookie atau localStorage.

## Risks / Trade-offs

- **[Risk]**: `EventSource` standar tidak mendukung header kustom (Authorization Bearer).
- **[Mitigation]**: Gunakan library `fetch-event-source` dari Microsoft atau lewatkan token via query param (kurang aman) / cookies (lebih aman).
- **[Risk]**: State sync antara sidebar dan main content.
- **[Mitigation]**: Gunakan Zustand selectors untuk memastikan komponen hanya melakukan re-render saat data yang relevan berubah.
