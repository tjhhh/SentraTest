const { test, expect } = require('@playwright/test');
const path = require('path');

test('Verify button interaction and logic execution', async ({ page }) => {
    // Load the local sandbox.html file
    const filePath = 'file://' + path.join(__dirname, 'sandbox.html');
    await page.goto(filePath);

    // Log the step and click the button
    console.log('[STEP: CLICK] clicking button');
    const button = page.locator('button');
    await expect(button).toBeVisible();
    await button.click();

    // Execute the logic function 't' to verify branch coverage (single branch in this case)
    console.log('[STEP: EVALUATE] executing function t()');
    const result = await page.evaluate(() => {
        if (typeof t === 'function') {
            return t();
        }
        return null;
    });

    // Basic assertion if t exists
    if (result !== null) {
        expect(result).toBe(1);
    }

    // Take a screenshot as per requirements
    const screenshotName = 'result-' + Date.now() + '.png';
    await page.screenshot({ path: path.join(__dirname, 'screenshots', screenshotName) });
});