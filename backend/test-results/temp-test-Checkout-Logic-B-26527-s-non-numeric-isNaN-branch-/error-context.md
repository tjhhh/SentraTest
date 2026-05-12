# Instructions

- Following Playwright test failed.
- Explain why, be concise, respect Playwright best practices.
- Provide a snippet of code with the fix, if possible.

# Test info

- Name: temp-test.spec.js >> Checkout Logic Branch Coverage Tests >> invalid input: should display error when price is non-numeric (isNaN branch)
- Location: temp-test.spec.js:77:5

# Error details

```
Error: page.fill: Error: Cannot type text into input[type=number]
Call log:
  - waiting for locator('#price')
    - locator resolved to <input id="price" type="number" placeholder="Harga" class="w-full border mb-2 p-2"/>
    - fill("abc")
  - attempting fill action
    - waiting for element to be visible, enabled and editable

```

# Page snapshot

```yaml
- generic [ref=e2]:
  - heading "Checkout Page" [level=2] [ref=e3]
  - spinbutton [ref=e4]
  - spinbutton [ref=e5]
  - button "Check Total" [ref=e6] [cursor=pointer]
  - paragraph
```

# Test source

```ts
  1  | const { test, expect } = require('@playwright/test');
  2  | const path = require('path');
  3  | 
  4  | test.describe('Checkout Logic Branch Coverage Tests', () => {
  5  | 
  6  |     test.beforeEach(async ({ page }) => {
  7  |         const filePath = 'file://' + path.join(__dirname, 'sandbox.html');
  8  |         await page.goto(filePath);
  9  |     });
  10 | 
  11 |     test('valid input: should display correct total with positive integers', async ({ page }) => {
  12 |         console.log('[STEP: TYPE] entering price 15000');
  13 |         await page.fill('#price', '15000');
  14 |         
  15 |         console.log('[STEP: TYPE] entering qty 3');
  16 |         await page.fill('#qty', '3');
  17 |         
  18 |         console.log('[STEP: CLICK] clicking button#check-btn');
  19 |         await page.click('#check-btn');
  20 | 
  21 |         const display = page.locator('#display');
  22 |         await expect(display).toHaveText('Total: Rp 45.000');
  23 |         await expect(display).toHaveCSS('color', 'rgb(0, 128, 0)'); // green
  24 | 
  25 |         await page.screenshot({ path: path.join(__dirname, 'screenshots', 'result-' + Date.now() + '.png') });
  26 |     });
  27 | 
  28 |     test('invalid input: should display error when price is zero (p <= 0 branch)', async ({ page }) => {
  29 |         console.log('[STEP: TYPE] entering price 0');
  30 |         await page.fill('#price', '0');
  31 |         
  32 |         console.log('[STEP: TYPE] entering qty 10');
  33 |         await page.fill('#qty', '10');
  34 |         
  35 |         console.log('[STEP: CLICK] clicking button#check-btn');
  36 |         await page.click('#check-btn');
  37 | 
  38 |         const display = page.locator('#display');
  39 |         await expect(display).toHaveText('Input Tidak Valid');
  40 |         await expect(display).toHaveCSS('color', 'rgb(255, 0, 0)'); // red
  41 | 
  42 |         await page.screenshot({ path: path.join(__dirname, 'screenshots', 'result-' + Date.now() + '.png') });
  43 |     });
  44 | 
  45 |     test('invalid input: should display error when qty is negative (q <= 0 branch)', async ({ page }) => {
  46 |         console.log('[STEP: TYPE] entering price 100');
  47 |         await page.fill('#price', '100');
  48 |         
  49 |         console.log('[STEP: TYPE] entering qty -5');
  50 |         await page.fill('#qty', '-5');
  51 |         
  52 |         console.log('[STEP: CLICK] clicking button#check-btn');
  53 |         await page.click('#check-btn');
  54 | 
  55 |         const display = page.locator('#display');
  56 |         await expect(display).toHaveText('Input Tidak Valid');
  57 | 
  58 |         await page.screenshot({ path: path.join(__dirname, 'screenshots', 'result-' + Date.now() + '.png') });
  59 |     });
  60 | 
  61 |     test('invalid input: should display error when inputs are empty (isNaN branch)', async ({ page }) => {
  62 |         console.log('[STEP: TYPE] leaving price empty');
  63 |         await page.fill('#price', '');
  64 |         
  65 |         console.log('[STEP: TYPE] leaving qty empty');
  66 |         await page.fill('#qty', '');
  67 |         
  68 |         console.log('[STEP: CLICK] clicking button#check-btn');
  69 |         await page.click('#check-btn');
  70 | 
  71 |         const display = page.locator('#display');
  72 |         await expect(display).toHaveText('Input Tidak Valid');
  73 | 
  74 |         await page.screenshot({ path: path.join(__dirname, 'screenshots', 'result-' + Date.now() + '.png') });
  75 |     });
  76 | 
  77 |     test('invalid input: should display error when price is non-numeric (isNaN branch)', async ({ page }) => {
  78 |         // Playwright fill might be restricted by type="number", but we test the logic branch
  79 |         console.log('[STEP: TYPE] entering invalid price string');
> 80 |         await page.fill('#price', 'abc');
     |                    ^ Error: page.fill: Error: Cannot type text into input[type=number]
  81 |         
  82 |         console.log('[STEP: TYPE] entering qty 1');
  83 |         await page.fill('#qty', '1');
  84 |         
  85 |         console.log('[STEP: CLICK] clicking button#check-btn');
  86 |         await page.click('#check-btn');
  87 | 
  88 |         const display = page.locator('#display');
  89 |         await expect(display).toHaveText('Input Tidak Valid');
  90 | 
  91 |         await page.screenshot({ path: path.join(__dirname, 'screenshots', 'result-' + Date.now() + '.png') });
  92 |     });
  93 | 
  94 | });
```