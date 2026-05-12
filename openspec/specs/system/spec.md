# Domain: Contextual Assistant (Chatbox)

## 1. Overview
Asisten virtual yang berfungsi sebagai konsultan QA untuk membantu pengguna menentukan strategi pengujian dan menganalisis kesalahan pada kode atau test case.

## 2. Requirements

### Requirement: Test Strategy Advisor
Sistem HARUS mampu memberikan saran metode pengujian (BVA, EQP, atau DT) yang paling efektif berdasarkan deskripsi fitur yang ditanyakan pengguna.

#### Scenario: Method Recommendation
- *GIVEN* pengguna bertanya tentang metode terbaik untuk fitur tertentu (misal: Login).
- *WHEN* sistem mendeteksi input berupa kombinasi logika atau batasan nilai.
- *THEN* Gemini API memberikan saran metode (misal: Decision Table untuk Login) beserta alasannya.

### Requirement: Bug Explainer
Sistem HARUS bisa menjelaskan pesan error atau log yang diberikan oleh pengguna.

#### Scenario: Error Analysis
- *GIVEN* pengguna memberikan potongan pesan error (stack trace).
- *WHEN* pengguna meminta penjelasan penyebab error.
- *THEN* sistem menganalisis kemungkinan penyebab di sisi Backend (Express) atau Frontend (Next.js) dan memberikan saran perbaikan.

### Requirement: Contextual Q&A
Sistem HARUS memiliki ingatan terhadap test case yang baru saja digenerate untuk menjawab pertanyaan lanjutan.

#### Scenario: Follow-up Question
- *GIVEN* pengguna baru saja melakukan generate Blackbox BVA.
- *WHEN* pengguna bertanya "Kenapa angka 0 masuk ke dalam tes ini?".
- *THEN* sistem menjawab berdasarkan aturan metode BVA yang diterapkan pada requirement tersebut.