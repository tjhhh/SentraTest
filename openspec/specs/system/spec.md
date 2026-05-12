# Domain: System Foundation

## Requirements

### Requirement: Environment-based Configuration
Sistem MUST membaca konfigurasi runtime dari environment variables tervalidasi untuk semua komponen backend kritikal.

#### Scenario: Missing mandatory environment variable
- **WHEN** aplikasi dijalankan tanpa environment variable wajib
- **THEN** sistem SHALL gagal start dengan pesan error konfigurasi yang jelas

### Requirement: Containerized Deployment Support
Sistem MUST mendukung deployment container dengan image backend yang dapat dijalankan konsisten lintas environment.

#### Scenario: Run backend container
- **WHEN** image backend dijalankan pada runtime container
- **THEN** sistem SHALL menjalankan service API pada port dan konfigurasi yang ditentukan

### Requirement: Kubernetes Baseline Manifests
Sistem MUST menyediakan manifest Kubernetes baseline untuk deployment backend service dan konfigurasi secret/env.

#### Scenario: Apply manifests
- **WHEN** manifest Kubernetes baseline diterapkan pada cluster yang valid
- **THEN** sistem SHALL membuat resource minimum yang dibutuhkan untuk menjalankan backend secara operasional

### Requirement: Multi-format Result Export
Sistem MUST menyediakan opsi bagi pengguna untuk mengunduh hasil pengujian dalam format PDF, JSON, atau ZIP.

#### Scenario: Download Export File
- **WHEN** pengguna memilih format "JSON" dan menekan tombol download
- **THEN** sistem SHALL memanggil endpoint export yang sesuai
- **THEN** sistem SHALL memicu pengunduhan file ke komputer pengguna
