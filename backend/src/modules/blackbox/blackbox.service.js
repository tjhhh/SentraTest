const { buildPrompt } = require("../../services/ai/promptOrchestrator.service");
const { generateText } = require("../../services/ai/gemini.service");
const { parseJsonSafe, normalizeGenerationOutput } = require("../../services/ai/outputParser.service");
const { createTestCase, findLatestByConversationId } = require("./blackbox.repository");

async function generate({ userId, conversationId, method, requirement, requestId }) {
  const prompt = buildPrompt({
    mode: "blackbox-generate",
    input: requirement,
    method,
  });

  const ai = await generateText(prompt, requestId);
  const parsed = parseJsonSafe(ai.text);
  const output = normalizeGenerationOutput("blackbox", parsed);

  const payload = {
    ...output,
    requirement,
    method: method.toUpperCase(),
    generatedAt: new Date().toISOString(),
    testCaseCount: Array.isArray(output.content?.testCases) ? output.content.testCases.length : 0,
  };

  await createTestCase({
    userId,
    conversationId,
    type: `BLACKBOX_${method}`,
    payload,
  });

  return payload;
}

async function getHistory(conversationId) {
  const latest = await findLatestByConversationId(conversationId);
  return latest;
}

async function generateScript({ method, testCases }) {
  if (!Array.isArray(testCases) || testCases.length === 0) {
    throw new Error("testCases must be a non-empty array");
  }

  // Generate individual test functions for each test case
  const testFunctions = testCases.map((tc, index) => {
    const testId = tc.id || `TC_${String(index + 1).padStart(3, '0')}`;
    const testName = (tc.description || tc.scenario || `Test Case ${index + 1}`)
      .replace(/'/g, "\\'")
      .substring(0, 100);
    
    const inputs = typeof tc.inputs === 'object' ? tc.inputs : {};
    const expectedOutput = tc.expectedOutput || tc.expectedResult || '';

    return `  test('${testId}: ${testName}', async ({ page }) => {
    // Test Case: ${testName}
    // Inputs: ${JSON.stringify(inputs)}
    // Expected: ${expectedOutput}
    
    await page.goto('http://localhost:3000');
    
    // TODO: Implement test steps based on inputs
    // Example:
    // await page.fill('input[name="email"]', '${inputs.email || 'test@example.com'}');
    // await page.fill('input[name="password"]', '${inputs.password || 'password123'}');
    // await page.click('button:has-text("Login")');
    
    // TODO: Add assertions based on expected output
    // Example:
    // await expect(page).toHaveURL(/.*dashboard.*/);
  });`;
  }).join('\n\n');

  const tutorial = `/**
 * ===============================================================================
 * PLAYWRIGHT TEST SCRIPT - BLACKBOX TESTING WITH ${method}
 * ===============================================================================
 * 
 * SETUP & INSTALLATION
 * ====================
 * 1. Install Playwright:
 *    npm install -D @playwright/test
 * 
 * 2. Save this file in your project:
 *    tests/blackbox/test-${method.toLowerCase()}-[timestamp].spec.ts
 * 
 * RUNNING TESTS
 * =============
 * Command Line:
 *   npx playwright test                          # Run all tests
 *   npx playwright test --ui                     # Interactive UI mode
 *   npx playwright test --headed                 # See browser running
 *   npx playwright test --debug                  # Debug mode
 *   npx playwright test [filename].spec.ts       # Run specific file
 * 
 * UPDATING TEST CASES
 * ===================
 * Each test has TODO sections. You must complete them:
 * 
 * 1. NAVIGATE TO PAGE:
 *    await page.goto('http://localhost:3000/auth/login');
 * 
 * 2. FILL FORM FIELDS:
 *    Using name attribute:
 *      await page.fill('input[name="email"]', 'test@example.com');
 *      await page.fill('input[name="password"]', 'password123');
 *    
 *    Using id attribute:
 *      await page.fill('#emailInput', 'test@example.com');
 *      await page.fill('#passwordInput', 'password123');
 *    
 *    Using data-testid:
 *      await page.fill('[data-testid="email-field"]', 'test@example.com');
 * 
 * 3. INTERACT WITH ELEMENTS:
 *    Click button:
 *      await page.click('button:has-text("Login")');
 *      await page.click('button[type="submit"]');
 *      await page.click('[data-testid="login-btn"]');
 *    
 *    Type in field:
 *      await page.locator('input[name="email"]').fill('test@example.com');
 *    
 *    Select dropdown:
 *      await page.selectOption('select[name="country"]', 'US');
 * 
 * 4. ADD ASSERTIONS (EXPECTED OUTCOMES):
 *    Check URL:
 *      await expect(page).toHaveURL(/.*dashboard.*/);
 *      await page.waitForURL(/.*dashboard.*/);
 *    
 *    Check text visible:
 *      await expect(page.locator('.success-message')).toContainText('Login berhasil');
 *      await expect(page.locator('.error')).toContainText('Email atau password salah');
 *    
 *    Check element visible/hidden:
 *      await expect(page.locator('.modal')).toBeVisible();
 *      await expect(page.locator('.error-msg')).not.toBeVisible();
 *    
 *    Check form state:
 *      await expect(page.locator('input[name="email"]')).toHaveValue('test@example.com');
 *      await expect(page.locator('button[type="submit"]')).toBeDisabled();
 * 
 * FINDING SELECTORS
 * =================
 * Step 1: Open browser DevTools (F12)
 * Step 2: Right-click on element → "Inspect"
 * Step 3: Look for attributes in HTML:
 *   - data-testid (BEST - most reliable)
 *   - name attribute (GOOD - for forms)
 *   - id attribute (GOOD)
 *   - class names (OK - can be flaky)
 * 
 * Example HTML:
 *   <input name="email" id="emailInput" data-testid="email-field" />
 * 
 * Selectors (in order of preference):
 *   1. await page.fill('[data-testid="email-field"]', 'test@example.com');
 *   2. await page.fill('input[name="email"]', 'test@example.com');
 *   3. await page.fill('#emailInput', 'test@example.com');
 * 
 * WAIT STRATEGIES
 * ===============
 * Wait for element to appear:
 *   await page.waitForSelector('.modal', { timeout: 5000 });
 * 
 * Wait for URL to change:
 *   await page.waitForURL(/.*dashboard.*/, { timeout: 5000 });
 * 
 * Wait for element to be visible:
 *   await page.locator('.btn').waitFor({ state: 'visible' });
 * 
 * Wait for network idle:
 *   await page.waitForLoadState('networkidle');
 * 
 * COMMON TEST PATTERNS
 * ====================
 * 
 * SUCCESS TEST (Login berhasil):
 *   test('Login dengan valid credentials', async ({ page }) => {
 *     await page.goto('http://localhost:3000/auth/login');
 *     await page.fill('input[name="email"]', 'test@example.com');
 *     await page.fill('input[name="password"]', 'password123');
 *     await page.click('button:has-text("Login")');
 *     
 *     // Assert success
 *     await page.waitForURL(/.*dashboard.*/);
 *     await expect(page).toHaveURL(/.*dashboard.*/);
 *   });
 * 
 * ERROR TEST (Invalid email):
 *   test('Login dengan email invalid', async ({ page }) => {
 *     await page.goto('http://localhost:3000/auth/login');
 *     await page.fill('input[name="email"]', 'invalidemail');
 *     await page.fill('input[name="password"]', 'password123');
 *     await page.click('button[type="submit"]');
 *     
 *     // Assert error shown
 *     await expect(page.locator('.error-message')).toContainText('Format email tidak valid');
 *     // Assert NOT redirected
 *     await expect(page).toHaveURL(/.*login.*/);
 *   });
 * 
 * BOUNDARY TEST (Min/Max values):
 *   test('Password minimal 8 karakter', async ({ page }) => {
 *     await page.goto('http://localhost:3000/auth/login');
 *     await page.fill('input[name="password"]', 'short');  // 5 chars
 *     await page.click('button[type="submit"]');
 *     
 *     // Assert error
 *     await expect(page.locator('.error')).toContainText('minimal 8 karakter');
 *   });
 * 
 * DEBUGGING TIPS
 * ==============
 * 1. Use page.screenshot() to capture test state:
 *    await page.screenshot({ path: 'debug.png' });
 * 
 * 2. Use page.locator().screenshot() for single elements:
 *    await page.locator('input[name="email"]').screenshot({ path: 'email-field.png' });
 * 
 * 3. Enable headed mode to see browser:
 *    npx playwright test --headed
 * 
 * 4. Use debug mode to pause execution:
 *    npx playwright test --debug
 *    Then use step over/in buttons
 * 
 * 5. Console logging:
 *    await page.evaluate(() => console.log('Value:', document.querySelector('input').value));
 * 
 * ASSERTION REFERENCE
 * ===================
 * await expect(page).toHaveTitle('Page Title');
 * await expect(page).toHaveURL(/.*dashboard.*/);
 * await expect(locator).toBeVisible();
 * await expect(locator).toBeHidden();
 * await expect(locator).toBeEnabled();
 * await expect(locator).toBeDisabled();
 * await expect(locator).toContainText('Expected text');
 * await expect(locator).toHaveText('Exact text');
 * await expect(locator).toHaveValue('input value');
 * await expect(locator).toHaveCount(5);  // 5 elements
 * 
 * BEST PRACTICES
 * ==============
 * ✓ Use data-testid attributes (most reliable)
 * ✓ Add explicit waits for async operations
 * ✓ Use page.waitForLoadState() after navigation
 * ✓ Take screenshots of failures for debugging
 * ✓ Use descriptive test names
 * ✓ Group related tests in describe() blocks
 * ✓ Keep test data separate (constants at top)
 * 
 * ✗ Don't use brittle selectors (classes that change often)
 * ✗ Don't add arbitrary delays (sleep/timeout)
 * ✗ Don't use hardcoded timeouts without reason
 * ✗ Don't test UI implementation details
 * 
 * NEXT STEPS
 * ==========
 * 1. Update each test TODO section with real selectors
 * 2. Replace 'http://localhost:3000' with your actual base URL
 * 3. Use your application's actual form field names/IDs
 * 4. Run: npx playwright test --ui
 * 5. Debug failing tests using DevTools inspector
 * 6. Iterate until all tests pass ✓
 * 
 * For more info: https://playwright.dev/docs/writing-tests
 * ===============================================================================
 */
`;

  const script = `${tutorial}

import { test, expect } from '@playwright/test';

describe('${method} - Blackbox Testing', () => {
${testFunctions}
});
`;

  return { script, testCount: testCases.length, method };
}

module.exports = { generate, generateScript };
