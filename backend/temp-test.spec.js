const { test, expect } = require('@playwright/test');

const htmlContent = `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Discount Testing Page</title>
    <style>
        body { font-family: sans-serif; padding: 20px; }
        .container { max-width: 300px; border: 1px solid #ccc; padding: 20px; border-radius: 8px; }
        input, select, button { width: 100%; margin-bottom: 10px; padding: 8px; box-sizing: border-box; }
        #result { font-weight: bold; color: #4f46e5; }
    </style>
</head>
<body>
    <div class="container">
        <h3>Discount Calculator</h3>
        <label for="price">Price:</label>
        <input type="number" id="price" placeholder="Enter price">
        <label for="type">Customer Type:</label>
        <select id="type">
            <option value="REGULAR">Regular</option>
            <option value="VIP">VIP</option>
        </select>
        <button id="calculate-btn">Calculate</button>
        <p>Final Price: <span id="result">0</span></p>
    </div>
    <script>
        function calculateDiscount(price, type) {
            if (price > 100) {
                if (type === 'VIP') {
                    return price * 0.8;
                }
                return price * 0.9;
            }
            return price;
        }
        document.getElementById('calculate-btn').addEventListener('click', () => {
            const price = parseFloat(document.getElementById('price').value);
            const type = document.getElementById('type').value;
            const finalPrice = calculateDiscount(price, type);
            document.getElementById('result').textContent = finalPrice;
        });
    </script>
</body>
</html>
`;

test.describe('Discount Calculator Branch Coverage', () => {
  test.beforeEach(async ({ page }) => {
    await page.setContent(htmlContent);
  });

  test('should return original price when price is 100 or less (Branch: price > 100 is false)', async ({ page }) => {
    await page.fill('#price', '100');
    await page.selectOption('#type', 'REGULAR');
    await page.click('#calculate-btn');
    await expect(page.locator('#result')).hasText('100');
  });

  test('should apply 20% discount for VIP when price is over 100 (Branch: price > 100 is true, type === "VIP" is true)', async ({ page }) => {
    await page.fill('#price', '200');
    await page.selectOption('#type', 'VIP');
    await page.click('#calculate-btn');
    await expect(page.locator('#result')).hasText('160');
  });

  test('should apply 10% discount for REGULAR when price is over 100 (Branch: price > 100 is true, type === "VIP" is false)', async ({ page }) => {
    await page.fill('#price', '200');
    await page.selectOption('#type', 'REGULAR');
    await page.click('#calculate-btn');
    await expect(page.locator('#result')).hasText('180');
  });
});