## 1. Setup & Dependencies

- [x] 1.1 Pasang dependensi `swagger-ui-express` dan `swagger-jsdoc`.
- [x] 1.2 Buat file konfigurasi Swagger (`src/config/swagger.js`) yang mendefinisikan informasi dasar API dan skema keamanan JWT.

## 2. Global Integration

- [x] 2.1 Integrasikan middleware Swagger UI pada `backend/src/app.js` di endpoint `/api/docs`.
- [x] 2.2 Pastikan endpoint documentation dapat diakses secara publik meskipun route lain terproteksi.

## 3. API Annotations

- [x] 3.1 Tambahkan anotasi OpenAPI pada module `auth` (register, login, refresh, logout).
- [x] 3.2 Tambahkan anotasi OpenAPI pada module `conversation` (list, create, rename, delete).
- [x] 3.3 Tambahkan anotasi OpenAPI pada module `message` (get messages).
- [x] 3.4 Tambahkan anotasi OpenAPI pada module `chat` (post chat - sync & stream).
- [x] 3.5 Tambahkan anotasi OpenAPI pada module `blackbox` (generate, script, export).
- [x] 3.6 Tambahkan anotasi OpenAPI pada module `whitebox` (analyze, script).
- [x] 3.7 Tambahkan anotasi OpenAPI pada module `bug` (explain).
- [x] 3.8 Tambahkan anotasi OpenAPI pada module `export` (pdf, zip, docx, json).

## 4. Verification

- [x] 4.1 Jalankan aplikasi dan verifikasi tampilan UI di browser.
- [x] 4.2 Uji coba alur "Authorize" menggunakan token JWT hasil login.
- [x] 4.3 Pastikan skema input/output di UI sesuai dengan validasi Zod yang sudah ada.
