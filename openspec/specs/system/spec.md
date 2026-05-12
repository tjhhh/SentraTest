# Domain: System Error Handling & Observability

## Requirements

### Requirement: Global Error Handler
Sistem HARUS memiliki middleware penanganan error terpusat yang mencegah "silent errors" dan mempermudah proses debugging bagi developer.

#### Scenario: Handle Internal Server Errors (500)
- GIVEN terjadi error yang tidak terduga pada server (misal: database connection error)
- WHEN error dilempar ke global error handler
- THEN sistem HARUS mencetak detail error secara lengkap ke console (termasuk stack trace)
- AND sistem mengembalikan HTTP status 500
- AND jika environment adalah 'development', response body berisi detail error dan stack trace
- AND jika environment adalah 'production', response body hanya berisi pesan generic "Internal Server Error" demi keamanan

#### Scenario: Handle Validation Errors (400)
- GIVEN pengguna mengirim data yang tidak sesuai format (gagal di express-validator)
- WHEN request ditolak
- THEN sistem mengembalikan HTTP status 400
- AND response body HARUS berisi daftar detail validasi yang gagal dalam format array

#### Scenario: Handle Not Found Routes (404)
- GIVEN pengguna mengakses endpoint API yang tidak terdaftar
- WHEN route tidak ditemukan
- THEN sistem mengembalikan HTTP status 404
- AND response body berisi pesan "API endpoint not found"

### Requirement: Request Logging
Sistem HARUS mencatat (log) setiap request yang masuk untuk mempermudah pelacakan (traceability).

#### Scenario: Log Incoming Requests
- GIVEN ada request HTTP masuk ke server
- WHEN request diproses
- THEN sistem mencetak log singkat ke console berisi: Method, URL, dan Status Code (bisa menggunakan library seperti 'morgan')