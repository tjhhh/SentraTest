const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Checkout Page Logic Coverage', () => {

    test('Valid Inputs: Should calculate and display total correctly', async ({ page }) => {
        await page.goto('file://' + path.join(__dirname, 'sandbox.html'));

        console.log('[STEP: TYPE] filling price input with 10000');
        await page.fill('#price', '10000');

        console.log('[STEP: TYPE] filling qty input with 5');
        await page.fill('#qty', '5');

        console.log('[STEP: CLICK] clicking #check-btn');
        await page.click('#check-btn');

        const display = page.locator('#display');
        await expect(display).toHaveText('Total: Rp 50.000');
        await expect(display).toHaveCSS('color', 'rgb(0, 128, 0)');

        await page.screenshot({ path: path.join(__dirname, 'screenshots', 'result-' + Date.now() + '.png') });
    });

    test('Invalid Input: Empty price should trigger validation error', async ({ page }) => {
        await page.goto('file://' + path.join(__dirname, 'sandbox.html'));

        console.log('[STEP: TYPE] filling qty input with 5');
        await page.fill('#qty', '5');

        console.log('[STEP: CLICK] clicking #check-btn with empty price');
        await page.click('#check-btn');

        const display = page.locator('#display');
        await expect(display).toHaveText('Input Tidak Valid');
        await expect(display).toHaveCSS('color', 'rgb(255, 0, 0)');

        await page.screenshot({ path: path.join(__dirname, 'screenshots', 'result-' + Date.now() + '.png') });
    });

    test('Invalid Input: Zero price should trigger validation error', async ({ page }) => {
        await page.goto('file://' + path.join(__dirname, 'sandbox.html'));

        console.log('[STEP: TYPE] filling price input with 0');
        await page.fill('#price', '0');

        console.log('[STEP: TYPE] filling qty input with 10');
        await page.fill('#qty', '10');

        console.log('[STEP: CLICK] clicking #check-btn');
        await page.click('#check-btn');

        const display = page.locator('#display');
        await expect(display).toHaveText('Input Tidak Valid');

        await page.screenshot({ path: path.join(__dirname, 'screenshots', 'result-' + Date.now() + '.png') });
    });

    test('Invalid Input: Negative quantity should trigger validation error', async ({ page }) => {
        await page.goto('file://' + path.join(__dirname, 'sandbox.html'));

        console.log('[STEP: TYPE] filling price input with 500');
        await page.fill('#price', '500');

        console.log('[STEP: TYPE] filling qty input with -1');
        await page.fill('#qty', '-1');

        console.log('[STEP: CLICK] clicking #check-btn');
        await page.click('#check-btn');

        const display = page.locator('#display');
        await expect(display).toHaveText('Input Tidak Valid');

        await page.screenshot({ path: path.join(__dirname, 'screenshots', 'result-' + Date.now() + '.png') });
    });

    test('Invalid Input: Empty quantity should trigger validation error', async ({ page }) => {
        await page.goto('file://' + path.join(__dirname, 'sandbox.html'));

        console.log('[STEP: TYPE] filling price input with 500');
        await page.fill('#price', '500');

        console.log('[STEP: CLICK] clicking #check-btn with empty quantity');
        await page.click('#check-btn');

        const display = page.locator('#display');
        await expect(display).toHaveText('Input Tidak Valid');

        await page.screenshot({ path: path.join(__dirname, 'screenshots', 'result-' + Date.now() + '.png') });
    });
});