## Context

Backend SentraTest saat ini memiliki banyak endpoint yang tersebar di berbagai modul. Tanpa dokumentasi interaktif, tim pengembang dan QA harus bergantung pada pembacaan kode atau dokumentasi manual untuk memahami parameter input dan format output. Integrasi Swagger akan menyatukan seluruh kontrak API ke dalam satu antarmuka yang dapat dieksekusi.

## Goals / Non-Goals

**Goals:**
- Mengotomatiskan generasi spesifikasi OpenAPI 3.0 dari kode sumber.
- Menyediakan antarmuka Swagger UI di `/api/docs`.
- Mendukung pengujian endpoint terproteksi dengan input JWT Token langsung di UI.
- Mencakup dokumentasi untuk seluruh modul inti (auth, chat, generator, dsb.).

**Non-Goals:**
- Membuat dokumentasi manual statis yang tidak sinkron dengan kode.
- Mengintegrasikan Swagger untuk service pihak ketiga di luar backend SentraTest.

## Decisions

1. **Library: `swagger-jsdoc` & `swagger-ui-express`**
   - *Rationale*: `swagger-jsdoc` memungkinkan kita menulis dokumentasi langsung di dekat definisi route menggunakan JSDoc, sehingga memudahkan pemeliharaan. `swagger-ui-express` adalah standar untuk menyajikan antarmuka Swagger di Express.
   - *Alternative*: Menulis file `swagger.json` secara manual (sulit dipelihara) atau menggunakan `tsoa` (membutuhkan refactor besar ke TypeScript decorator).

2. **OpenAPI Version: 3.0.0**
   - *Rationale*: Versi yang paling stabil dan didukung luas oleh ekosistem tooling saat ini.

3. **Security Scheme: Bearer Auth**
   - *Rationale*: Sesuai dengan implementasi JWT yang sudah ada di sistem. Menambahkan definisi `securitySchemes` di Swagger config akan memunculkan tombol "Authorize" di UI.

## Risks / Trade-offs

- **[Risk]**: Anotasi JSDoc membuat file route menjadi lebih panjang.
- **[Mitigation]**: Gunakan format yang ringkas dan pisahkan schema kompleks ke dalam file YAML/JSON terpisah jika diperlukan, lalu referensikan via `$ref`.
- **[Risk]**: Dokumentasi tidak sinkron jika pengembang lupa memperbarui anotasi.
- **[Mitigation]**: Jadikan review JSDoc sebagai bagian dari proses Code Review dan tambahkan script validasi spesifikasi pada pipeline CI jika memungkinkan.
