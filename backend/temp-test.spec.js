const { test, expect } = require('@playwright/test');
const path = require('path');
const fs = require('fs');

// Ensure screenshots directory exists
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
    fs.mkdirSync(screenshotsDir);
}

test.describe('Checkout Page Logic Branch Coverage', () => {

  test.beforeEach(async ({ page }) => {
    await page.goto('file://' + path.join(__dirname, 'sandbox.html'));
  });

  test('Success Case: Calculate total with valid positive integers', async ({ page }) => {
    console.log('[STEP: TYPE] entering valid price: 5000');
    await page.fill('#price', '5000');
    
    console.log('[STEP: TYPE] entering valid quantity: 3');
    await page.fill('#qty', '3');
    
    console.log('[STEP: CLICK] clicking button#check-btn');
    await page.click('#check-btn');

    const display = page.locator('#display');
    await expect(display).toHaveText('Total: Rp 15.000');
    await expect(display).toHaveCSS('color', 'rgb(0, 128, 0)');

    await page.screenshot({ path: path.join(__dirname, 'screenshots', 'result-' + Date.now() + '.png') });
  });

  test('Error Case: Invalid price (zero or negative)', async ({ page }) => {
    console.log('[STEP: TYPE] entering invalid price: 0');
    await page.fill('#price', '0');
    
    console.log('[STEP: TYPE] entering valid quantity: 5');
    await page.fill('#qty', '5');
    
    console.log('[STEP: CLICK] clicking button#check-btn');
    await page.click('#check-btn');

    const display = page.locator('#display');
    await expect(display).toHaveText('Input Tidak Valid');
    await expect(display).toHaveCSS('color', 'rgb(255, 0, 0)');

    await page.screenshot({ path: path.join(__dirname, 'screenshots', 'result-' + Date.now() + '.png') });
  });

  test('Error Case: Invalid quantity (zero or negative)', async ({ page }) => {
    console.log('[STEP: TYPE] entering valid price: 1000');
    await page.fill('#price', '1000');
    
    console.log('[STEP: TYPE] entering invalid quantity: -1');
    await page.fill('#qty', '-1');
    
    console.log('[STEP: CLICK] clicking button#check-btn');
    await page.click('#check-btn');

    const display = page.locator('#display');
    await expect(display).toHaveText('Input Tidak Valid');
    await expect(display).toHaveCSS('color', 'rgb(255, 0, 0)');

    await page.screenshot({ path: path.join(__dirname, 'screenshots', 'result-' + Date.now() + '.png') });
  });

  test('Error Case: Non-numeric or empty inputs', async ({ page }) => {
    console.log('[STEP: TYPE] leaving price empty');
    await page.fill('#price', '');
    
    console.log('[STEP: TYPE] entering valid quantity: 10');
    await page.fill('#qty', '10');
    
    console.log('[STEP: CLICK] clicking button#check-btn');
    await page.click('#check-btn');

    const display = page.locator('#display');
    await expect(display).toHaveText('Input Tidak Valid');
    await expect(display).toHaveCSS('color', 'rgb(255, 0, 0)');

    await page.screenshot({ path: path.join(__dirname, 'screenshots', 'result-' + Date.now() + '.png') });
  });
});