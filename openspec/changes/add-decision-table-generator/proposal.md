## Why

Decision Table adalah teknik testing yang powerful untuk menangani kompleks kombinasi conditions dan actions. Mirip dengan BVA, Decision Table memerlukan expertise untuk mengidentifikasi semua condition combinations dengan akurat. Fitur ini memberikan akses otomatis ke Decision Table generation berbasis AI, membantu QA generate test cases sistematis tanpa manual effort.

## What Changes

- Menambahkan interface untuk user input functional requirement dengan focus pada conditions dan actions
- Integrasi dengan Gemini API untuk analyze requirement dan generate Decision Table
- Menghasilkan structured decision table dengan kombinasi conditions → actions yang comprehensive
- Menampilkan Decision Table dalam UI yang jelas dengan informasi conditions, actions, dan test case combinations

## Capabilities

### New Capabilities
- `decision-table-test-generation`: User dapat menginput functional requirement dan system akan generate Decision Table test cases menggunakan AI

### Modified Capabilities
- `blackbox-testing`: Menambahkan Decision Table (DT) sebagai salah satu tipe test generation di samping BVA dan EQP

## Impact

- **Frontend (Next.js)**:
  - Tambah form input untuk requirement di halaman Decision Table
  - Tambah component untuk display conditions, actions, dan test case combinations
  - Tambah button export ke CSV/PDF
  
- **Backend (Node.js)**:
  - Tambah API endpoint untuk Decision Table generation
  - Integrasi dengan Gemini API untuk analyze conditions dan actions
  
- **Dependencies**:
  - Gemini API client library (sudah ada untuk BVA)
  - CSV/PDF export library (sama dengan BVA)
