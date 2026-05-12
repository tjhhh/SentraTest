# Domain: Black Box Generator (Decision Table Delta Spec)

## MODIFIED Requirements

### Requirement: Generate Test Cases from Requirements
Sistem HARUS menghasilkan test cases berdasarkan input requirement dengan support Decision Table methodology.

#### Scenario: Generate Decision Table
- **GIVEN** user telah memilih tipe test "Decision Table"
- **WHEN** user menginput deskripsi requirement fitur
- **THEN** sistem menggunakan Gemini API untuk menganalisis conditions dan actions
- **AND** menampilkan Decision Table dengan comprehensive condition combinations
- **AND** setiap test case HARUS memiliki: ID, name, conditions mapping, expected actions, category

#### Scenario: Analyze conditions and actions
- **GIVEN** requirement text sudah diterima dan divalidasi
- **WHEN** Gemini API menganalisis requirement
- **THEN** sistem mengidentifikasi semua business logic conditions
- **AND** sistem mengidentifikasi semua possible actions/outcomes
- **AND** sistem generate combinations dari conditions mapping ke actions
