# Design: Whitebox Screenshot Integration

## Backend Consolidation
We will use `backend/src/screenshots` as the single source of truth for all screenshots.

### Controller Update (`whitebox.controller.js`)
```javascript
const screenshotsDir = path.join(__dirname, "../../screenshots");
// ...
res.write(`\n[EVIDENCE: SCREENSHOTS] ${result.screenshots.join(",")}\n`);
```

### Service Update (`whitebox.service.js`)
Update the prompt instructions for Gemini:
```text
2. At the end of each test case, take a screenshot and save it to the shared screenshots directory: 
   await page.screenshot({ path: path.join(__dirname, '../../screenshots', 'result-' + Date.now() + '.png') });
```

## Frontend Standardization
- Update `EvidenceGallery.tsx` and `WhiteboxPage.tsx` to use `http://localhost:4000` as the default backend port.

## Validation Plan
1. Run a whitebox test suite.
2. Check the "Full Execution Logs" for the `[EVIDENCE: SCREENSHOTS]` line.
3. Verify that images appear in the "Visual Evidence" gallery.
4. Inspect the image URLs to ensure they point to port `4000`.
