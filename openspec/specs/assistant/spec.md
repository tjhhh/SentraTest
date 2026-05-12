# Domain: Contextual Assistant (Chatbox)

## Requirements

### Requirement: Contextual Q&A
Sistem HARUS menyediakan antarmuka chat yang memiliki konteks terhadap test case yang sedang dibuka.

#### Scenario: Asking about Test Case
- GIVEN pengguna sedang melihat sebuah test case BVA
- WHEN pengguna bertanya "Mengapa nilai ini diuji?" via chatbox
- THEN Gemini API menjawab berdasarkan konteks test case tersebut

### Requirement: Bug Explainer
Sistem HARUS bisa menjelaskan pesan error dari terminal/log.

#### Scenario: Error Analysis
- GIVEN pengguna menempelkan pesan error (stack trace) ke chatbox
- WHEN pengguna meminta penjelasan
- THEN sistem menganalisis error tersebut
- AND memberikan kemungkinan penyebab dan saran perbaikan