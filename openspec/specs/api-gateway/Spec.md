````md
# Domain: API Gateway & Infrastructure

---

# Requirements

## Requirement: REST API Endpoints
Sistem HARUS menyediakan REST API yang terstandarisasi.

### Scenario: API Response Format
**GIVEN** client request ke API  
**WHEN** request berhasil atau gagal  
**THEN** sistem return JSON response dengan format standar:

```json
{
  "success": true,
  "data": {},
  "error": null,
  "timestamp": "2026-05-12T10:00:00Z"
}
````

* AND menggunakan HTTP status code yang appropriate:

  * `200 OK`
  * `201 Created`
  * `400 Bad Request`
  * `401 Unauthorized`
  * `404 Not Found`
  * `500 Internal Server Error`

---

### Scenario: API Versioning

**GIVEN** kebutuhan untuk backward compatibility
**WHEN** API mengalami breaking changes
**THEN** sistem implement API versioning di URL:

```txt
/api/v1/
/api/v2/
```

* AND sistem maintain minimal 2 versi API aktif
* AND sistem deprecate versi lama dengan notice 6 bulan

---

### Scenario: Rate Limiting

**GIVEN** client membuat banyak requests
**WHEN** requests melebihi limit:

* 100 requests/menit untuk authenticated user
* 20 requests/menit untuk public access

**THEN** sistem return:

```http
HTTP 429 Too Many Requests
```

* AND sistem include headers:

  * `X-RateLimit-Limit`
  * `X-RateLimit-Remaining`
  * `X-RateLimit-Reset`
* AND sistem implement sliding window algorithm

---

# Requirement: CORS & Security Headers

Sistem HARUS mengkonfigurasi security headers yang tepat.

### Scenario: CORS Configuration

**GIVEN** request dari browser
**WHEN** origin berbeda dengan API domain
**THEN** sistem check allowed origins dari environment configuration

* AND sistem set headers:

  * `Access-Control-Allow-Origin`
  * `Access-Control-Allow-Methods`
  * `Access-Control-Allow-Headers`

* AND sistem hanya mengizinkan origins yang terdaftar:

  * Production → specific domain
  * Development → localhost

---

### Scenario: Security Headers

**GIVEN** setiap HTTP response
**WHEN** response dikirim ke client
**THEN** sistem set security headers berikut:

```http
X-Content-Type-Options: nosniff
X-Frame-Options: DENY
X-XSS-Protection: 1; mode=block
Strict-Transport-Security: max-age=31536000
Content-Security-Policy: default-src 'self'
```

* `Strict-Transport-Security` hanya aktif di production

---

# Requirement: Request Validation

Sistem HARUS memvalidasi semua input request.

### Scenario: Input Validation

**GIVEN** client mengirim request dengan body
**WHEN** request sampai di server
**THEN** sistem validasi request body menggunakan library seperti:

* Joi

* Zod

* express-validator

* AND sistem return:

```http
400 Bad Request
```

jika validation failed

* AND error message menampilkan field yang invalid secara spesifik

---

### Scenario: Sanitization

**GIVEN** input dari user
**WHEN** data diproses
**THEN** sistem melakukan sanitization untuk mencegah:

* XSS (Cross-Site Scripting)

* SQL Injection

* AND sistem escape special characters

* AND sistem validate & sanitize sebelum insert ke database

---

# Requirement: Error Handling

Sistem HARUS menangani error dengan graceful error handling.

### Scenario: Global Error Handler

**GIVEN** error terjadi di middleware atau route handler
**WHEN** error di-throw
**THEN** sistem:

* catch error di global error handler
* log detail error:

  * stack trace
  * request information
* return response error yang user-friendly
* tidak expose internal system details
* differentiate error types:

  * `ValidationError`
  * `AuthenticationError`
  * `DatabaseError`

---

### Scenario: 404 Not Found

**GIVEN** client request ke endpoint yang tidak ada
**WHEN** router tidak menemukan route yang match
**THEN** sistem return:

```http
404 Not Found
```

dengan response:

```json
{
  "success": false,
  "error": "Endpoint not found"
}
```

---

### Scenario: Unhandled Promise Rejection

**GIVEN** async operation gagal tanpa try-catch
**WHEN** promise rejected
**THEN** sistem:

* catch unhandled rejection
* log error untuk debugging
* graceful shutdown jika terjadi critical error

---

# Requirement: API Documentation (OpenSpec)

Sistem HARUS menyediakan dokumentasi API menggunakan OpenAPI/OpenSpec.

### Scenario: Auto-Generate OpenAPI Spec

**GIVEN** API endpoints menggunakan decorators/annotations
**WHEN** aplikasi start
**THEN** sistem generate OpenAPI 3.0 specification

* AND dokumentasi tersedia di:

  * `/api/docs`
  * `/api/spec`

* AND specification mencakup:

  * paths
  * parameters
  * request/response schemas
  * authentication requirements

---

### Scenario: Interactive API Documentation

**GIVEN** developer perlu testing API
**WHEN** mengakses `/api/docs`
**THEN** sistem menampilkan:

* Swagger UI

* atau ReDoc

* AND developer dapat mencoba endpoint langsung dari browser

* AND dokumentasi menyediakan contoh request/response

---

# Requirement: Health Check & Monitoring

Sistem HARUS menyediakan endpoint monitoring dan health check.

### Scenario: Health Check Endpoint

**GIVEN** monitoring system atau load balancer
**WHEN** request ke endpoint:

```txt
/health
/api/health
```

**THEN** sistem melakukan pengecekan:

* PostgreSQL connection

* Gemini API connectivity

* File storage connectivity (S3/Local)

* AND return status:

  * `"healthy"`
  * `"unhealthy"`

beserta detail status dependency

* AND response time < 100ms

---

### Scenario: Readiness Check

**GIVEN** Kubernetes atau orchestrator
**WHEN** readiness probe dijalankan
**THEN** sistem:

* verify aplikasi siap menerima request
* return:

  * `200 OK` jika ready
  * `503 Service Unavailable` jika belum ready
* memastikan seluruh dependencies telah terinisialisasi

---

### Scenario: Logging & Metrics

**GIVEN** setiap request ke API
**WHEN** request diproses
**THEN** sistem mencatat log berikut:

* timestamp

* HTTP method

* request path

* status code

* response time

* user_id (jika authenticated)

* AND sistem track metrics:

  * request count
  * error rate
  * average response time

* AND logs menggunakan structured JSON format untuk mempermudah parsing dan observability

```
```
