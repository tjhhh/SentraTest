const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Checkout Logic Branch Coverage Tests', () => {

    test.beforeEach(async ({ page }) => {
        const filePath = 'file://' + path.join(__dirname, 'sandbox.html');
        await page.goto(filePath);
    });

    test('valid input: should display correct total with positive integers', async ({ page }) => {
        console.log('[STEP: TYPE] entering price 15000');
        await page.fill('#price', '15000');
        
        console.log('[STEP: TYPE] entering qty 3');
        await page.fill('#qty', '3');
        
        console.log('[STEP: CLICK] clicking button#check-btn');
        await page.click('#check-btn');

        const display = page.locator('#display');
        await expect(display).toHaveText('Total: Rp 45.000');
        await expect(display).toHaveCSS('color', 'rgb(0, 128, 0)'); // green

        await page.screenshot({ path: path.join(__dirname, 'screenshots', 'result-' + Date.now() + '.png') });
    });

    test('invalid input: should display error when price is zero (p <= 0 branch)', async ({ page }) => {
        console.log('[STEP: TYPE] entering price 0');
        await page.fill('#price', '0');
        
        console.log('[STEP: TYPE] entering qty 10');
        await page.fill('#qty', '10');
        
        console.log('[STEP: CLICK] clicking button#check-btn');
        await page.click('#check-btn');

        const display = page.locator('#display');
        await expect(display).toHaveText('Input Tidak Valid');
        await expect(display).toHaveCSS('color', 'rgb(255, 0, 0)'); // red

        await page.screenshot({ path: path.join(__dirname, 'screenshots', 'result-' + Date.now() + '.png') });
    });

    test('invalid input: should display error when qty is negative (q <= 0 branch)', async ({ page }) => {
        console.log('[STEP: TYPE] entering price 100');
        await page.fill('#price', '100');
        
        console.log('[STEP: TYPE] entering qty -5');
        await page.fill('#qty', '-5');
        
        console.log('[STEP: CLICK] clicking button#check-btn');
        await page.click('#check-btn');

        const display = page.locator('#display');
        await expect(display).toHaveText('Input Tidak Valid');

        await page.screenshot({ path: path.join(__dirname, 'screenshots', 'result-' + Date.now() + '.png') });
    });

    test('invalid input: should display error when inputs are empty (isNaN branch)', async ({ page }) => {
        console.log('[STEP: TYPE] leaving price empty');
        await page.fill('#price', '');
        
        console.log('[STEP: TYPE] leaving qty empty');
        await page.fill('#qty', '');
        
        console.log('[STEP: CLICK] clicking button#check-btn');
        await page.click('#check-btn');

        const display = page.locator('#display');
        await expect(display).toHaveText('Input Tidak Valid');

        await page.screenshot({ path: path.join(__dirname, 'screenshots', 'result-' + Date.now() + '.png') });
    });

    test('invalid input: should display error when price is non-numeric (isNaN branch)', async ({ page }) => {
        // Playwright fill might be restricted by type="number", but we test the logic branch
        console.log('[STEP: TYPE] entering invalid price string');
        await page.fill('#price', 'abc');
        
        console.log('[STEP: TYPE] entering qty 1');
        await page.fill('#qty', '1');
        
        console.log('[STEP: CLICK] clicking button#check-btn');
        await page.click('#check-btn');

        const display = page.locator('#display');
        await expect(display).toHaveText('Input Tidak Valid');

        await page.screenshot({ path: path.join(__dirname, 'screenshots', 'result-' + Date.now() + '.png') });
    });

});