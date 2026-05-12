## Why

Boundary Value Analysis (BVA) adalah teknik testing yang powerful untuk menemukan edge cases, namun memerlukan expertise untuk mengidentifikasi boundaries dengan benar. Fitur ini memberikan akses otomatis ke test case generation berbasis BVA dengan memanfaatkan AI (Gemini API), sehingga pengguna dapat menghasilkan test cases berkualitas lebih cepat dan sistematis tanpa perlu expertise mendalam di BVA.

## What Changes

- Menambahkan interface untuk user input functional requirement/spesifikasi ke dalam Black Box Testing
- Integrasi dengan Gemini API untuk analisis otomatis boundary values dari requirement yang di-input
- Menghasilkan structured test cases berdasarkan model BVA dan menampilkannya di UI
- Menyediakan fitur view, export (CSV/PDF), dan save test cases

## Capabilities

### New Capabilities
- `bva-test-generation`: User dapat menginput functional requirement dan system akan generate test cases menggunakan Boundary Value Analysis methodology dengan bantuan Gemini API

### Modified Capabilities
- `blackbox-testing`: Menambahkan BVA sebagai salah satu tipe test generation di samping EQP dan DT yang sudah ada

## Impact

- **Frontend (Next.js)**: 
  - Tambah form input untuk requirement di halaman BVA
  - Tambah component untuk display test cases (table format)
  - Tambah button export ke CSV/PDF
  
- **Backend (Node.js)**:
  - Tambah API endpoint untuk BVA test case generation
  - Integrasi dengan Gemini API untuk analisis requirement
  
- **Database**: 
  - Tambah table untuk menyimpan history test cases (optional)
  
- **Dependencies**: 
  - Gemini API client library
  - PDF export library (misal: pdfkit atau similar)
  - CSV export library
