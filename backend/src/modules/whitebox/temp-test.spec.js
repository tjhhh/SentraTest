const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Math Utils and UI Checkout Integration', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('file://' + path.join(__dirname, 'sandbox.html'));
    });

    test('Test Case 1: Valid inputs calculate total correctly', async ({ page }) => {
        console.log('[STEP: FILL] filling #price with 10000');
        await page.fill('#price', '10000');
        
        console.log('[STEP: FILL] filling #qty with 3');
        await page.fill('#qty', '3');

        console.log('[STEP: CLICK] clicking button#check-btn');
        await page.click('#check-btn');

        const display = page.locator('#display');
        await expect(display).toHaveText('Total: Rp 30.000');
        await expect(display).toHaveCSS('color', 'rgb(0, 128, 0)');

        await page.screenshot({ path: path.join(__dirname, '../../screenshots', 'result-' + Date.now() + '.png') });
    });

    test('Test Case 2: Zero price triggers invalid input branch', async ({ page }) => {
        console.log('[STEP: FILL] filling #price with 0');
        await page.fill('#price', '0');

        console.log('[STEP: FILL] filling #qty with 5');
        await page.fill('#qty', '5');

        console.log('[STEP: CLICK] clicking button#check-btn');
        await page.click('#check-btn');

        const display = page.locator('#display');
        await expect(display).toHaveText('Input Tidak Valid');
        await expect(display).toHaveCSS('color', 'rgb(255, 0, 0)');

        await page.screenshot({ path: path.join(__dirname, '../../screenshots', 'result-' + Date.now() + '.png') });
    });

    test('Test Case 3: Negative quantity triggers invalid input branch', async ({ page }) => {
        console.log('[STEP: FILL] filling #price with 100');
        await page.fill('#price', '100');

        console.log('[STEP: FILL] filling #qty with -2');
        await page.fill('#qty', '-2');

        console.log('[STEP: CLICK] clicking button#check-btn');
        await page.click('#check-btn');

        const display = page.locator('#display');
        await expect(display).toHaveText('Input Tidak Valid');

        await page.screenshot({ path: path.join(__dirname, '../../screenshots', 'result-' + Date.now() + '.png') });
    });

    test('Test Case 4: Non-numeric price (NaN) triggers invalid input branch', async ({ page }) => {
        console.log('[STEP: TYPE] typing invalid characters into #price');
        await page.type('#price', 'abc');

        console.log('[STEP: FILL] filling #qty with 10');
        await page.fill('#qty', '10');

        console.log('[STEP: CLICK] clicking button#check-btn');
        await page.click('#check-btn');

        const display = page.locator('#display');
        await expect(display).toHaveText('Input Tidak Valid');

        await page.screenshot({ path: path.join(__dirname, '../../screenshots', 'result-' + Date.now() + '.png') });
    });

    test('Test Case 5: Empty fields (NaN) trigger invalid input branch', async ({ page }) => {
        console.log('[STEP: CLICK] clicking button#check-btn with empty fields');
        await page.click('#check-btn');

        const display = page.locator('#display');
        await expect(display).toHaveText('Input Tidak Valid');

        await page.screenshot({ path: path.join(__dirname, '../../screenshots', 'result-' + Date.now() + '.png') });
    });
});