const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Checkout Logic Statement Coverage', () => {

    test.beforeEach(async ({ page }) => {
        const filePath = 'file://' + path.join(__dirname, 'sandbox.html');
        await page.goto(filePath);
    });

    test('Valid input: price 1000 and qty 5', async ({ page }) => {
        console.log('[STEP: TYPE] entering price 1000');
        await page.fill('#price', '1000');

        console.log('[STEP: TYPE] entering qty 5');
        await page.fill('#qty', '5');

        console.log('[STEP: CLICK] clicking button#check-btn');
        await page.click('#check-btn');

        const display = page.locator('#display');
        await expect(display).toHaveText('Total: Rp 5.000');
        await expect(display).toHaveCSS('color', 'rgb(0, 128, 0)'); // green

        await page.screenshot({ path: path.join(__dirname, 'screenshots', 'result-' + Date.now() + '.png') });
    });

    test('Invalid input: Empty/NaN values', async ({ page }) => {
        console.log('[STEP: TYPE] leaving price empty');
        await page.fill('#price', '');

        console.log('[STEP: TYPE] entering qty 5');
        await page.fill('#qty', '5');

        console.log('[STEP: CLICK] clicking button#check-btn');
        await page.click('#check-btn');

        const display = page.locator('#display');
        await expect(display).toHaveText('Input Tidak Valid');
        await expect(display).toHaveCSS('color', 'rgb(255, 0, 0)'); // red

        await page.screenshot({ path: path.join(__dirname, 'screenshots', 'result-' + Date.now() + '.png') });
    });

    test('Invalid input: Zero or negative values', async ({ page }) => {
        console.log('[STEP: TYPE] entering price 100');
        await page.fill('#price', '100');

        console.log('[STEP: TYPE] entering negative qty -2');
        await page.fill('#qty', '-2');

        console.log('[STEP: CLICK] clicking button#check-btn');
        await page.click('#check-btn');

        const display = page.locator('#display');
        await expect(display).toHaveText('Input Tidak Valid');
        
        // Test price as zero as well
        console.log('[STEP: TYPE] entering zero price');
        await page.fill('#price', '0');
        await page.fill('#qty', '10');
        await page.click('#check-btn');
        await expect(display).toHaveText('Input Tidak Valid');

        await page.screenshot({ path: path.join(__dirname, 'screenshots', 'result-' + Date.now() + '.png') });
    });
});