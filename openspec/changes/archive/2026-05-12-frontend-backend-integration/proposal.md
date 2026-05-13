## Why

Integrasi ini diperlukan untuk menghubungkan frontend Next.js yang sudah ada dengan kapabilitas backend AI Test Automation Platform. Hal ini memungkinkan pengguna akhir untuk melakukan autentikasi, berinteraksi dengan asisten AI melalui chat streaming, serta menghasilkan test case dan script otomatis secara langsung dari antarmuka web yang modern dan responsif.

## What Changes

- Implementasi API Service Layer (`services/`) untuk abstraksi komunikasi REST ke backend.
- Integrasi State Management menggunakan `Zustand` untuk mengelola auth, conversation, dan hasil generasi AI.
- Implementasi SSE Client untuk mendukung streaming respons AI secara realtime.
- Penambahan middleware untuk proteksi route (auth-guarded routes).
- Pengaktifan fitur login/register dan sinkronisasi dengan JWT backend.
- Integrasi sidebar conversation dengan fitur CRUD yang terhubung ke database.
- Implementasi modul generator (Black Box, White Box, Bug Explainer) dan sistem export.

## Capabilities

### New Capabilities
- `frontend-auth`: Integrasi UI login/register dengan backend JWT dan proteksi route.
- `frontend-chat`: Antarmuka chat interaktif dengan dukungan SSE streaming dan rendering markdown.
- `frontend-generators`: Modul generasi testcase Black Box (BVA, EQP, DT) dan White Box (Statement, Branch, Path).
- `frontend-bug-explainer`: Fitur analisis stack trace dan rekomendasi solusi via UI.
- `frontend-export`: Integrasi sistem export hasil pengujian (PDF, JSON, ZIP) dari UI.

### Modified Capabilities
<!-- Tidak ada perubahan requirement pada kapabilitas backend, hanya integrasi di sisi frontend -->

## Impact

- **Affected Code**: Folder `frontend/src/app`, `components`, `hooks`, `services`, `store`, `types`.
- **Dependencies**: Penambahan `zustand` untuk state management, `lucide-react` (jika belum ada), dan parser markdown (misal: `react-markdown`).
- **APIs**: Konsumsi seluruh endpoint `/api/*` yang disediakan oleh backend Express.
