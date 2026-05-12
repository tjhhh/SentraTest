## Context

Sistem Black Box Testing sudah memiliki tiga jenis test generation: BVA, EQP, dan DT. Saat ini, fitur BVA belum diimplementasikan di backend/frontend. User perlu cara yang sistematis untuk menginput requirement dan mendapatkan test cases berdasarkan Boundary Value Analysis methodology. Kami memiliki akses ke Gemini API untuk AI-powered analysis.

## Goals / Non-Goals

**Goals:**
- User dapat menginput functional requirement teks dan system menganalisis boundary values dengan AI
- Generate structured test cases dengan format BVA (boundary points, expected results)
- Menampilkan test cases dalam UI yang mudah dibaca (table format)
- Export test cases ke CSV dan PDF
- Menyimpan history test cases untuk reference

**Non-Goals:**
- Manual editing/customization test cases setelah generate
- Collaborative features untuk team testing
- Version control untuk test case histories
- Integration dengan external test management tools

## Decisions

### 1. **AI Analysis Strategy**
**Decision:** Use Gemini API dengan prompt engineering untuk analyze requirement dan identify BVA boundaries
- **Why**: Gemini capable of understanding domain-specific requirements dan dapat mengidentifikasi edge cases dengan akurat
- **Alternative Considered**: Template-based generation (tidak cukup flexible), regex patterns (terlalu rigid)
- **Implementation**: Send requirement text ke Gemini dengan specific prompt untuk BVA analysis, parse structured JSON response

### 2. **Data Model**
**Decision:** Backend response dalam format JSON structured dengan BVA metadata
```json
{
  "id": "uuid",
  "requirementText": "string",
  "testCases": [
    {
      "id": "uuid",
      "name": "string",
      "input": "object",
      "expectedOutput": "object",
      "boundaryType": "lower|upper|exact|invalid",
      "category": "valid|boundary|invalid"
    }
  ],
  "metadata": {
    "generatedAt": "timestamp",
    "boundariesIdentified": number
  }
}
```
- **Why**: Structured format mudah di-render di frontend dan di-export
- **Storage**: Database table `bva_test_cases` dengan fields: id, requirement_text, test_cases (JSON), created_at, user_id

### 3. **API Architecture**
**Decision:** Create new endpoint `POST /api/blackbox/bva/generate`
- Request body: `{ requirementText: string }`
- Response: Test cases dalam format JSON di atas
- **Processing Flow**: Frontend → Backend API → Gemini API → Parse response → Store + Return to Frontend

### 4. **Frontend UI Flow**
**Decision:** Multi-step interface di `/dashboard/blackbox/bva`
1. Step 1: Input form untuk requirement text (textarea)
2. Step 2: Display generated test cases dalam table format
3. Actions: Export CSV, Export PDF, View Details, Save, Clear

### 5. **Export Strategy**
**Decision:** Dual export format
- **CSV**: Simple tabular format dengan columns (ID, Name, Input, Expected Output, Boundary Type, Category)
- **PDF**: Formatted report dengan header (requirement, generated date), test cases table, summary statistics
- **Libraries**: 
  - Backend: `papaparse` untuk CSV generation, `pdfkit` atau `puppeteer` untuk PDF
  - Or use serverless service untuk PDF generation

### 6. **Error Handling**
**Decision:** Three-tier error handling
1. **Validation**: Input requirement length (min 50, max 2000 chars), rate limiting (max 5 requests per hour per user)
2. **API Errors**: Retry logic dengan exponential backoff untuk Gemini API calls
3. **Parsing Errors**: Fallback ke template-based generation jika Gemini response tidak parseable

## Risks / Trade-offs

| Risk | Impact | Mitigation |
|------|--------|-----------|
| **Gemini API Rate Limiting** | User blocked from generating test cases | Implement request queuing, show estimated wait time, limit concurrency per user |
| **Poor AI Analysis** | Generated test cases tidak akurat atau relevant | Iterate prompt engineering, provide feedback mechanism untuk user, add manual review capability |
| **Large File Export** | Timeout pada PDF/CSV generation | Implement chunking, limit export size (max 500 test cases), background job processing |
| **Invalid Requirement Input** | AI generates nonsensical test cases | Strict input validation, clear guidance text, AI confidence scoring untuk results |
| **Database Growth** | History table grows unbounded | Implement retention policy (keep last 90 days), archival strategy |

## Migration Plan

**Phase 1 (Development):**
1. Create database migration untuk `bva_test_cases` table
2. Implement Gemini API integration dengan prompt templates
3. Build backend endpoint dengan validation + parsing
4. Create frontend components dan forms

**Phase 2 (Testing):**
1. Test dengan various requirement inputs (simple, complex, edge cases)
2. Validate Gemini response parsing robustness
3. Load test API endpoint untuk rate limiting
4. Export functionality testing (CSV + PDF)

**Phase 3 (Deployment):**
1. Deploy backend changes
2. Deploy database migration
3. Deploy frontend changes
4. Monitor Gemini API quota usage dan response quality

**Rollback Strategy:** 
- If Gemini API fails, disable BVA feature temporarily (show message "Feature temporarily unavailable")
- Database rollback: Keep data, just don't expose in UI

## Open Questions

1. **Database Storage**: Haruskah menyimpan semua test cases history atau hanya recent ones?
2. **API Rate Limits**: Berapa request per user per hour yang reasonable?
3. **Gemini Model**: Gunakan `gemini-pro` atau `gemini-pro-vision`? Version terbaru apa?
4. **PDF Styling**: Apakah ada brand guidelines untuk PDF report styling?
5. **Async Processing**: Untuk large requirement, haruskah processing async dengan background job queue?
6. **User Authentication**: BVA access terbatas ke authenticated users saja, atau ada permission levels?
