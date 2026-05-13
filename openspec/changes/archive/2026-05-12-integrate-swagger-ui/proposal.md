## Why

Backend saat ini telah memiliki fungsionalitas inti (auth, chat, generator, dsb.) namun belum memiliki antarmuka dokumentasi yang interaktif. Integrasi Swagger/OpenAPI diperlukan sekarang untuk memudahkan pengujian manual oleh QA, mempercepat proses integrasi frontend, serta menyediakan referensi kontrak API yang selalu mutakhir.

## What Changes

- Penambahan dependensi `swagger-ui-express` dan `jsdoc` (atau plugin OpenAPI).
- Implementasi middleware Swagger UI pada endpoint `/api/docs`.
- Penambahan anotasi JSDoc/OpenAPI pada seluruh route di domain `auth`, `conversations`, `messages`, `chat`, `blackbox`, `whitebox`, `bug`, dan `export`.
- Konfigurasi skema keamanan JWT agar dapat diuji langsung melalui antarmuka Swagger.

## Capabilities

### New Capabilities
- `api-documentation`: Menyediakan dokumentasi API interaktif menggunakan standar OpenAPI 3.0 dan antarmuka Swagger UI.

### Modified Capabilities
<!-- Tidak ada perubahan requirement bisnis pada kapabilitas yang sudah ada -->

## Impact

- **Affected Code**: `backend/src/app.js`, `backend/src/routes/index.js`, dan seluruh file route di dalam `backend/src/modules/**`.
- **Dependencies**: Penambahan `swagger-ui-express` dan parser OpenAPI.
- **APIs**: Penambahan endpoint publik baru `/api/docs`.
