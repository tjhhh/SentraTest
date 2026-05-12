# Domain: White-Box Test Case Generator

## Requirements

### Requirement: Source Code Analysis
Sistem HARUS menganalisis source code untuk menghasilkan test case white-box.

#### Scenario: Upload Source Code
- GIVEN developer yang ingin generate white-box test cases
- WHEN pengguna upload source code (JavaScript, Python, Java, TypeScript)
- THEN sistem memvalidasi file type dan size
- AND sistem parse source code untuk analisis struktur
- AND sistem menampilkan preview kode yang diupload

#### Scenario: Paste Source Code
- GIVEN developer yang ingin analisis kode cepat
- WHEN pengguna paste source code ke text editor
- THEN sistem menerima input kode (max 10000 karakter)
- AND sistem melakukan syntax checking
- AND sistem mempersiapkan kode untuk analisis

### Requirement: Statement Coverage Analysis
Sistem HARUS mengidentifikasi baris kode yang belum tercakup pengujian.

#### Scenario: Analyze Statement Coverage
- GIVEN source code dengan multiple statements
- WHEN sistem menganalisis statement coverage
- THEN sistem mengidentifikasi setiap baris/pernyataan dalam kode
- AND sistem merekomendasikan test case untuk mengeksekusi setiap statement
- AND sistem menampilkan persentase coverage yang dapat dicapai

#### Scenario: Identify Untested Statements
- GIVEN source code dengan beberapa statements yang kompleks
- WHEN sistem menganalisis
- THEN sistem menandai statements yang kemungkinan belum tercakup
- AND sistem generate test case untuk mencapai 100% statement coverage

### Requirement: Branch Coverage Analysis
Sistem HARUS menganalisis semua cabang kondisional dalam kode.

#### Scenario: Analyze Branch Coverage
- GIVEN source code dengan if/else, switch statements
- WHEN sistem menganalisis branch coverage
- THEN sistem mengidentifikasi semua conditional branches
- AND sistem memetakan true/false path untuk setiap condition
- AND sistem generate test case untuk setiap branch

#### Scenario: Nested Conditionals
- GIVEN source code dengan nested if-else (3 level atau lebih)
- WHEN sistem menganalisis
- THEN sistem mengidentifikasi semua kombinasi branches
- AND sistem generate test case untuk setiap path melalui nested conditions
- AND sistem menampilkan complexity metric (cyclomatic complexity)

#### Scenario: Switch Case Coverage
- GIVEN source code dengan switch statement (multiple cases)
- WHEN sistem menganalisis
- THEN sistem mengidentifikasi semua case branches dan default
- AND sistem generate test case untuk setiap case
- AND sistem memastikan default case juga tercakup

### Requirement: Path Coverage Analysis
Sistem HARUS memetakan semua jalur eksekusi yang mungkin.

#### Scenario: Analyze Path Coverage
- GIVEN source code dengan multiple execution paths
- WHEN sistem menganalisis path coverage
- THEN sistem memetakan semua jalur dari entry ke exit point
- AND sistem mengidentifikasi independent paths
- AND sistem generate test case untuk setiap independent path

#### Scenario: Loop Path Analysis
- GIVEN source code dengan loops (for, while)
- WHEN sistem menganalisis
- THEN sistem mengidentifikasi paths untuk: loop tidak dieksekusi, dieksekusi sekali, dieksekusi multiple kali
- AND sistem generate test case untuk setiap loop scenario

#### Scenario: Complex Path Mapping
- GIVEN source code dengan complexity tinggi (>10)
- WHEN sistem menganalisis paths
- THEN sistem mengidentifikasi high-risk paths
- AND sistem prioritize test cases untuk paths yang kompleks
- AND sistem memberikan warning untuk paths yang sulit di-test

### Requirement: Edge Condition Detection
Sistem HARUS mengidentifikasi kondisi tepi yang berpotensi menyebabkan bug.

#### Scenario: Detect Null/Undefined Handling
- GIVEN source code yang memproses input
- WHEN sistem menganalisis
- THEN sistem mengidentifikasi lokasi yang tidak handle null/undefined
- AND sistem generate test case untuk null/undefined inputs
- AND sistem merekomendasikan perbaikan kode

#### Scenario: Detect Boundary Conditions in Code
- GIVEN source code dengan array operations dan index access
- WHEN sistem menganalisis
- THEN sistem mengidentifikasi potensi off-by-one errors
- AND sistem generate test case untuk index: 0, length-1, length
- AND sistem flag potential array out of bounds

#### Scenario: Detect Exception Handling Gaps
- GIVEN source code dengan operasi yang dapat throw exceptions
- WHEN sistem menganalisis
- THEN sistem mengidentifikasi try-catch blocks yang ada
- AND sistem mengidentifikasi operasi tanpa exception handling
- AND sistem recommend test case untuk exception scenarios

### Requirement: Code Quality Recommendations
Sistem HARUS memberikan saran perbaikan kode berdasarkan best practices.

#### Scenario: Identify Code Smells
- GIVEN source code yang dianalisis
- WHEN sistem mendeteksi code smells
- THEN sistem mengidentifikasi: long functions, duplicate code, complex conditions
- AND sistem memberikan rekomendasi refactoring
- AND sistem menjelaskan impact terhadap testability

#### Scenario: Suggest Testability Improvements
- GIVEN source code yang sulit di-test
- WHEN sistem menganalisis
- THEN sistem mengidentifikasi dependencies yang tight coupling
- AND sistem recommend dependency injection
- AND sistem suggest cara improve testability