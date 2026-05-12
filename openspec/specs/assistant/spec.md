# Domain: AI Chatbot & Bug Explainer

## Requirements

### Requirement: AI Chat Assistant
Sistem HARUS menyediakan chatbot AI berbasis Gemini untuk konsultasi testing dan QA.

#### Scenario: Start New Chat Session
- GIVEN pengguna yang sudah login
- WHEN pengguna membuat sesi chat baru
- THEN sistem membuat record chat session di database
- AND sistem menampilkan interface chat kosong
- AND AI menyapa pengguna dengan pesan welcome

#### Scenario: Ask About Testing Methodology
- GIVEN pengguna dalam sesi chat aktif
- WHEN pengguna bertanya "Apa perbedaan BVA dan ECP?"
- THEN sistem mengirim pertanyaan ke Gemini AI
- AND AI memberikan penjelasan mendalam tentang perbedaan BVA dan ECP
- AND sistem menyimpan percakapan ke database
- AND respons ditampilkan dalam format yang mudah dibaca

#### Scenario: Contextual Conversation
- GIVEN pengguna sedang berdiskusi tentang test case login
- WHEN pengguna bertanya lanjutan "Bagaimana dengan edge case-nya?"
- THEN AI memahami konteks percakapan sebelumnya
- AND AI memberikan jawaban yang relevan dengan konteks test case login
- AND sistem menjaga conversation history dalam sesi yang sama

#### Scenario: Multi-Session Management
- GIVEN pengguna dengan multiple sesi chat
- WHEN pengguna berpindah antar sesi chat
- THEN sistem menampilkan history percakapan yang sesuai
- AND konteks AI terjaga per sesi
- AND pengguna dapat rename, hapus, atau arsipkan sesi

### Requirement: Bug Explainer
Sistem HARUS menyediakan fitur khusus untuk menjelaskan error logs dan debugging.

#### Scenario: Explain Error Log
- GIVEN developer yang mengalami error
- WHEN pengguna paste error log atau stack trace ke chatbot
- THEN sistem mengirim error log ke Gemini AI dengan prompt khusus Bug Explainer
- AND AI menjelaskan error dalam bahasa yang sederhana
- AND AI mengidentifikasi kemungkinan root cause
- AND AI memberikan saran langkah debugging yang actionable

#### Scenario: Explain Build Failure
- GIVEN developer dengan build failure
- WHEN pengguna paste pesan build error
- THEN AI menganalisis error message
- AND AI menjelaskan penyebab build failure
- AND AI memberikan contoh perbaikan kode yang relevan

#### Scenario: Runtime Error Explanation
- GIVEN developer mengalami runtime error
- WHEN pengguna describe error yang terjadi
- THEN AI memberikan penjelasan teknis yang disederhanakan
- AND AI menyarankan cara reproduce dan fix error

### Requirement: Conversation History & Persistence
Sistem HARUS menyimpan dan mengelola riwayat percakapan pengguna.

#### Scenario: Persistent Chat History
- GIVEN pengguna dengan riwayat chat sebelumnya
- WHEN pengguna login kembali
- THEN sistem menampilkan daftar sesi chat sebelumnya
- AND pengguna dapat melanjutkan percakapan yang tersimpan
- AND semua pesan sebelumnya dapat diakses

#### Scenario: Delete Chat Session
- GIVEN pengguna dengan sesi chat yang ada
- WHEN pengguna memilih untuk menghapus sesi chat
- THEN sistem menghapus semua pesan dalam sesi tersebut dari database
- AND sesi chat dihapus dari daftar
- AND sistem menampilkan konfirmasi "Chat berhasil dihapus"

#### Scenario: Search Chat History
- GIVEN pengguna dengan banyak riwayat chat
- WHEN pengguna mencari topik tertentu (misal: "BVA")
- THEN sistem mencari dalam conversation history
- AND sistem menampilkan sesi chat yang relevan

## API Requirements

### Requirement: AI Chat Assistant — Route Integration
The system SHALL provide an HTTP API for AI-powered chat conversations.

#### Scenario: Send message and receive AI reply
- **WHEN** a user sends `POST /api/chats/:chatId/messages` with `{ userId, content }`
- **THEN** the system SHALL save the user message to the database
- **AND** call the AI service `chat()` function with conversation context
- **AND** save the AI-generated reply to the database
- **AND** return both the user message ID and the assistant reply in the response

#### Scenario: Welcome message on new chat
- **WHEN** a user creates a new chat session via `POST /api/chats`
- **THEN** the system SHALL create the chat record in the database
- **AND** insert a static welcome message as the first assistant message
- **AND** return the chat ID and welcome message in the response

#### Scenario: Contextual follow-up conversation
- **WHEN** a user sends a follow-up message in an existing chat
- **THEN** the AI service SHALL load the last 10 messages from the session as context
- **AND** the AI reply SHALL be relevant to the prior conversation
- **AND** the conversation history SHALL be persisted in the database

### Requirement: Multi-Session Management
The system SHALL support managing multiple chat sessions per user.

#### Scenario: List chat sessions
- **WHEN** a user requests `GET /api/chats?userId=`
- **THEN** the system SHALL return all chat sessions for that user ordered by `updated_at` DESC
- **AND** support pagination via `limit` and `offset` query params

#### Scenario: Rename chat session
- **WHEN** a user sends `PATCH /api/chats/:id` with `{ title }`
- **THEN** the system SHALL update the chat title in the database
- **AND** update the `updated_at` timestamp
- **AND** return the updated chat record

#### Scenario: Delete chat session
- **WHEN** a user sends `DELETE /api/chats/:id`
- **THEN** the system SHALL delete all messages in the session (cascade)
- **AND** delete the chat record
- **AND** return 204 No Content

### Requirement: Bug Explainer Endpoint
The system SHALL provide a dedicated endpoint for AI-powered error log explanation.

#### Scenario: Explain error log
- **WHEN** a user sends `POST /api/chats/:chatId/explain-bug` with `{ userId, errorLog }`
- **THEN** the system SHALL save the error log as a user message
- **AND** call the AI service `explainBug()` function with the error log
- **AND** save the structured AI explanation as an assistant message
- **AND** return the structured explanation (errorExplanation, possibleCauses, debuggingSteps, codeFixExamples)

#### Scenario: Explain build failure
- **WHEN** a user submits a build error message via the bug explainer
- **THEN** the AI SHALL analyze the error and provide a structured response
- **AND** include cause identification, debugging steps, and code fix examples

#### Scenario: Explain runtime error
- **WHEN** a user describes a runtime error via the bug explainer
- **THEN** the AI SHALL provide a simplified technical explanation
- **AND** suggest reproduction steps and fix approaches

### Requirement: Chat History Search
The system SHALL support searching across chat message content.

#### Scenario: Search chat messages
- **WHEN** a user sends `GET /api/chats/search?userId=&q=`
- **THEN** the system SHALL search message content using PostgreSQL full-text search
- **AND** return matching chat sessions with relevant message snippets
- **AND** results SHALL be ordered by relevance

#### Scenario: Search with no results
- **WHEN** a user searches for a keyword with no matches
- **THEN** the system SHALL return an empty results array
- **AND** return 200 with `{ data: [], total: 0 }`

### Requirement: Conversation Persistence
The system SHALL persist all chat conversations to the database.

#### Scenario: Resume previous conversation
- **WHEN** a user loads an existing chat session via `GET /api/chats/:chatId/messages`
- **THEN** the system SHALL return all messages in chronological order
- **AND** support pagination for long conversations (limit 100, offset)
- **AND** the user SHALL be able to continue the conversation by sending new messages

#### Scenario: Message history after restart
- **WHEN** the application restarts
- **THEN** all previous chat sessions and messages SHALL be available
- **AND** users SHALL be able to continue any previous conversation

#### Scenario: Quick Action Triggers
- GIVEN pengguna berada di halaman assistant
- WHEN pengguna mengklik tombol quick action "Analyze Error" atau "Suggest Strategy"
- THEN sistem otomatis memasukkan template prompt ke dalam text area
- AND pengguna dapat melengkapi prompt tersebut sebelum mengirimkannya
- ATAU sistem langsung mengirimkan predefined prompt ke backend dengan flag khusus

### Requirement: User Feedback Management
Sistem HARUS memungkinkan pengguna memberikan feedback terhadap kualitas respons AI.

#### Scenario: Submit Message Feedback
- GIVEN AI telah memberikan respons dalam sesi chat
- WHEN pengguna mengklik tombol Thumbs Up (Like) atau Thumbs Down (Dislike)
- THEN frontend mengirim request PATCH/PUT ke backend API
- AND sistem memperbarui record pesan tersebut di database dengan status feedback
- AND UI memberikan indikasi visual bahwa feedback telah dicatat

#### Scenario: Reset Current Conversation
- GIVEN pengguna berada dalam sesi chat aktif
- WHEN pengguna mengklik tombol "Reset Conversation"
- THEN frontend membersihkan state pesan saat ini (kecuali pesan welcome)
- AND sistem memulai sesi ID baru di backend tanpa menghapus riwayat sesi sebelumnya dari database