const { test, expect } = require('@playwright/test');
const path = require('path');

test.describe('Checkout Logic and UI Branch Coverage', () => {
    test.beforeEach(async ({ page }) => {
        await page.goto('file://' + path.join(__dirname, 'sandbox.html'));
    });

    test('should calculate total correctly for valid inputs', async ({ page }) => {
        await page.fill('#price', '10000');
        await page.fill('#qty', '3');
        await page.click('#check-btn');

        const display = page.locator('#display');
        await expect(display).toHaveText('Total: Rp 30.000');
        await expect(display).toHaveCSS('color', 'rgb(0, 128, 0)'); // green
    });

    test('should show error for non-numeric/empty inputs', async ({ page }) => {
        await page.fill('#price', '');
        await page.fill('#qty', '');
        await page.click('#check-btn');

        const display = page.locator('#display');
        await expect(display).toHaveText('Input Tidak Valid');
        await expect(display).toHaveCSS('color', 'rgb(255, 0, 0)'); // red
    });

    test('should show error for price less than or equal to zero', async ({ page }) => {
        await page.fill('#price', '0');
        await page.fill('#qty', '5');
        await page.click('#check-btn');

        const display = page.locator('#display');
        await expect(display).toHaveText('Input Tidak Valid');

        await page.fill('#price', '-50');
        await page.click('#check-btn');
        await expect(display).toHaveText('Input Tidak Valid');
    });

    test('should show error for quantity less than or equal to zero', async ({ page }) => {
        await page.fill('#price', '100');
        await page.fill('#qty', '0');
        await page.click('#check-btn');

        const display = page.locator('#display');
        await expect(display).toHaveText('Input Tidak Valid');

        await page.fill('#qty', '-1');
        await page.click('#check-btn');
        await expect(display).toHaveText('Input Tidak Valid');
    });

    test('should show error if price is NaN but qty is valid', async ({ page }) => {
        // Technically input type="number" limits this, but we test the logic branch
        await page.evaluate(() => {
            document.getElementById('price').value = 'abc';
        });
        await page.fill('#qty', '5');
        await page.click('#check-btn');

        const display = page.locator('#display');
        await expect(display).toHaveText('Input Tidak Valid');
    });
});