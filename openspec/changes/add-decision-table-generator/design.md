## Context

Sistem Black Box Testing sudah memiliki BVA dan EQP. Decision Table adalah metode ketiga yang belum diimplementasikan. User perlu cara sistematis untuk membuat Decision Table dari requirement yang complex dengan banyak conditions dan actions. Kami memiliki infrastructure Gemini API dari feature BVA.

## Goals / Non-Goals

**Goals:**
- User dapat menginput functional requirement dan system menganalisis conditions dan actions dengan AI
- Generate Decision Table dengan mapping condition combinations ke expected actions
- Menampilkan Decision Table dengan informasi conditions, actions, dan test cases
- Export test cases ke CSV dan PDF
- Menyimpan history Decision Table untuk reference

**Non-Goals:**
- Manual editing Decision Table setelah generate
- Conditional rule creation
- Probability-based test selection

## Decisions

### 1. **AI Analysis Strategy**
**Decision:** Use Gemini API untuk analyze requirement dan identify Decision Table structure
- **Why**: Gemini dapat memahami complex business logic dan generate condition combinations
- **Implementation**: Send requirement ke Gemini dengan structured prompt, parse JSON response dengan conditions dan actions

### 2. **Data Model**
**Decision:** Backend return structured Decision Table data
```json
{
  "conditions": [
    {"id": "cond-1", "name": "Age >= 18", "type": "boolean"}
  ],
  "actions": [
    {"id": "act-1", "name": "Allow access"}
  ],
  "testCases": [
    {
      "id": "dt-001",
      "name": "Test case name",
      "conditions": {"cond-1": true},
      "expectedActions": ["act-1"],
      "description": "...",
      "category": "normal"
    }
  ]
}
```

### 3. **API Architecture**
**Decision:** Create endpoint `POST /api/decision-table`
- Request body: `{ requirementText: string }`
- Response: Structured Decision Table data dengan conditions, actions, test cases
- Processing: Frontend → Backend → Gemini → Parse & Format → Store → Return

### 4. **Frontend UI Flow**
**Decision:** Single-page interface di `/blackbox/decision-table`
1. Input form untuk requirement text
2. Display conditions dan actions list
3. Display test case table dengan expandable rows
4. Export buttons (CSV, PDF)

### 5. **Export Strategy**
**Decision:** Same seperti BVA - CSV dan PDF export
- CSV: Tabular format dengan semua columns
- PDF: Formatted report dengan conditions, actions, dan test case table

## Risks / Trade-offs

| Risk | Mitigation |
|------|-----------|
| **Complex requirement analysis** | Iterasi prompt engineering, provide clear guidance text |
| **Condition explosion** | Limit max conditions (8-10), warn if too many |
| **Circular/contradictory conditions** | AI detects and notes in test case category |

## Open Questions

1. Berapa maximum conditions yang reasonable?
2. Bagaimana handle impossible condition combinations?
3. Perlu database untuk menyimpan history atau tidak?
