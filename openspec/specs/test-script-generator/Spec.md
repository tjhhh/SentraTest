# Domain: Test Script Generator

## Requirements

### Requirement: Playwright Script Generation
Sistem HARUS menghasilkan skrip otomasi testing menggunakan Playwright.

#### Scenario: Generate Playwright Script from Test Case
- GIVEN pengguna dengan test case yang telah dihasilkan
- WHEN pengguna memilih "Generate Playwright Script" dan upload source code (opsional)
- THEN sistem mengirim test case dan kode ke Gemini AI
- AND AI menghasilkan Playwright test script dalam JavaScript/TypeScript
- AND skrip mencakup: setup, test steps, assertions, teardown
- AND skrip mengikuti best practices Playwright
- AND sistem menampilkan preview skrip dalam code editor

#### Scenario: Playwright Script with Page Object Model
- GIVEN test case untuk aplikasi web yang kompleks
- WHEN pengguna memilih opsi "Use Page Object Model"
- THEN AI menghasilkan struktur POM (Page Objects terpisah dari test specs)
- AND sistem generate file terpisah untuk page objects dan test specs
- AND kode lebih maintainable dan reusable

#### Scenario: Playwright Script Validation
- GIVEN skrip Playwright yang dihasilkan
- WHEN sistem melakukan validation
- THEN sistem check syntax JavaScript/TypeScript
- AND sistem verify Playwright API usage yang correct
- AND sistem flag potential errors atau deprecated methods

### Requirement: Cypress Script Generation
Sistem HARUS menghasilkan skrip otomasi testing menggunakan Cypress.

#### Scenario: Generate Cypress Script
- GIVEN pengguna dengan test case yang siap
- WHEN pengguna memilih "Generate Cypress Script"
- THEN sistem menghasilkan Cypress test script dalam JavaScript
- AND skrip menggunakan Cypress commands yang appropriate (cy.visit, cy.get, cy.click)
- AND skrip mencakup assertions dengan should()
- AND skrip mengikuti Cypress best practices

#### Scenario: Cypress with Fixtures
- GIVEN test case yang memerlukan test data
- WHEN pengguna memilih opsi "Use Fixtures"
- THEN sistem generate fixture files (JSON) untuk test data
- AND test script menggunakan cy.fixture() untuk load data
- AND data test terpisah dari test logic

#### Scenario: Cypress Custom Commands
- GIVEN repetitive actions dalam test cases
- WHEN sistem mendeteksi pattern yang berulang
- THEN sistem merekomendasikan custom Cypress commands
- AND sistem generate contoh custom command di cypress/support/commands.js

### Requirement: Selenium Script Generation
Sistem HARUS menghasilkan skrip otomasi testing menggunakan Selenium WebDriver.

#### Scenario: Generate Selenium Script
- GIVEN pengguna dengan test case
- WHEN pengguna memilih "Generate Selenium Script"
- THEN sistem menghasilkan Selenium WebDriver script (Java/Python/JavaScript)
- AND skrip mencakup WebDriver setup, locators, actions, assertions
- AND skrip include proper teardown (driver.quit())

#### Scenario: Selenium with Explicit Waits
- GIVEN test case untuk aplikasi dengan dynamic content
- WHEN sistem generate Selenium script
- THEN sistem implement explicit waits (WebDriverWait)
- AND sistem avoid hard-coded sleeps
- AND sistem handle timing issues dengan proper waits

### Requirement: Script Preview & Download
Sistem HARUS menyediakan preview dan download untuk skrip yang dihasilkan.

#### Scenario: Preview Generated Script
- GIVEN skrip yang telah di-generate
- WHEN pengguna klik "Preview Script"
- THEN sistem menampilkan skrip dalam code editor dengan syntax highlighting
- AND pengguna dapat copy skrip ke clipboard
- AND pengguna dapat edit skrip langsung di editor (opsional)

#### Scenario: Download Script as File
- GIVEN skrip yang telah di-generate
- WHEN pengguna klik "Download Script"
- THEN sistem generate file dengan extension yang sesuai (.js, .ts, .py, .java)
- AND sistem download file ke local user
- AND nama file mengikuti konvensi: [test-case-name].spec.[ext]

#### Scenario: Download Complete Test Suite
- GIVEN multiple test cases yang telah di-generate
- WHEN pengguna memilih "Download Test Suite"
- THEN sistem package semua skrip dalam ZIP file
- AND sistem include README.md dengan instruksi setup dan run
- AND sistem include package.json/requirements.txt untuk dependencies