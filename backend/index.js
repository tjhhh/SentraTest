const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 5001;

app.use(cors());
app.use(express.json());
app.use('/screenshots', express.static(path.join(__dirname, 'screenshots')));

// Ensure screenshots directory exists
const screenshotsDir = path.join(__dirname, 'screenshots');
if (!fs.existsSync(screenshotsDir)) {
  fs.mkdirSync(screenshotsDir);
}

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY);

app.post('/api/whitebox/generate', async (req, res) => {
  const { logicCode, uiCode, coverageType } = req.body;

  if (!logicCode) {
    return res.status(400).json({ error: 'Logic code is required' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
      Analyze the following JavaScript logic and UI code. 
      Generate a Playwright test script (.spec.js) that interacts with the UI and achieves ${coverageType} coverage of the logic.

      The test script will run against a file named 'sandbox.html' which contains both the logic and the UI.
      Use 'await page.goto('file://' + path.join(__dirname, 'sandbox.html'))' to load the page.

      CRITICAL INSTRUCTIONS:
      1. For every major interaction (click, type, etc.), console.log a step marker like: console.log('[STEP: CLICK] clicking button#calculate-btn');
      2. At the end of each test case, take a screenshot and save it to the 'screenshots' directory with a descriptive name: await page.screenshot({ path: path.join(__dirname, 'screenshots', 'result-' + Date.now() + '.png') });
      3. The screenshot filename MUST start with 'result-' and end with '.png'.
      4. Make sure to import 'path' in the test script.

      Return the result as a JSON object with two keys:
      - "script": The full Playwright test script code (string).
      - "testTitles": An array of strings representing the titles/descriptions of each test case generated.

      Example output format:
      {
        "script": "const { test, expect } = require('@playwright/test'); ...",
        "testTitles": ["Test Case 1: Initial State", "Test Case 2: Discount Calculation"]
      }

      Return ONLY the raw JSON object, without any markdown formatting or explanations.

      Logic Code:
      ${logicCode}

      UI Code:
      ${uiCode || '<!-- No UI provided -->'}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let textResult = response.text();

    // Clean up markdown formatting if Gemini included it
    textResult = textResult.replace(/```json/g, '').replace(/```/g, '').trim();

    const { script: generatedScript, testTitles } = JSON.parse(textResult);

    // Generate sandbox HTML
    const sandboxHTML = generateSandboxHTML(logicCode, uiCode);
    fs.writeFileSync(path.join(__dirname, 'sandbox.html'), sandboxHTML);

    // Write to a temporary file for execution
    const tempFilePath = path.join(__dirname, 'temp-test.spec.js');
    fs.writeFileSync(tempFilePath, generatedScript);

    res.json({ script: generatedScript, testTitles });
  } catch (error) {
    console.error('Error generating script:', error);
    res.status(500).json({ error: 'Failed to generate script', details: error.message });
  }
});

function generateSandboxHTML(logic, ui) {
  let frameworkScripts = '';

  if (ui) {
    if (ui.includes('v-') || ui.includes('@click')) {
      frameworkScripts += '<script src="https://unpkg.com/vue@3/dist/vue.global.js"></script>\n';
    }
    if (ui.includes('React.') || ui.includes('jsx')) {
      frameworkScripts += '<script src="https://unpkg.com/react@18/umd/react.development.js"></script>\n';
      frameworkScripts += '<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"></script>\n';
      frameworkScripts += '<script src="https://unpkg.com/@babel/standalone/babel.min.js"></script>\n';
    }
  }

  return `
<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Sandbox</title>
    ${frameworkScripts}
    <script>
        ${logic}
    </script>
</head>
<body>
    ${ui || ''}
</body>
</html>
  `;
}

app.post('/api/whitebox/run', (req, res) => {
  // Clean up old screenshots and results
  const files = fs.readdirSync(screenshotsDir);
  for (const file of files) {
    if (file.endsWith('.png')) {
      fs.unlinkSync(path.join(screenshotsDir, file));
    }
  }
  const resultsPath = path.join(__dirname, 'test-results.json');
  if (fs.existsSync(resultsPath)) {
    fs.unlinkSync(resultsPath);
  }

  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Transfer-Encoding', 'chunked');

  // Run with JSON reporter and list reporter for streaming logs
  const child = spawn('npx', [
    'playwright', 'test', 'temp-test.spec.js',
    '--reporter=json,list'
  ], {
    shell: true,
    env: { ...process.env, PLAYWRIGHT_JSON_OUTPUT_FILE: resultsPath }
  });

  child.stdout.on('data', (data) => {
    res.write(data);
  });

  child.stderr.on('data', (data) => {
    res.write(data);
  });

  child.on('close', (code) => {
    // List new screenshots
    const newFiles = fs.readdirSync(screenshotsDir).filter(f => f.endsWith('.png'));
    res.write(`\n[EVIDENCE: SCREENSHOTS] ${newFiles.join(',')}\n`);

    // Parse and send results
    if (fs.existsSync(resultsPath)) {
      try {
        const rawResults = JSON.parse(fs.readFileSync(resultsPath, 'utf8'));
        const parsedResults = parsePlaywrightJson(rawResults);
        res.write(`\n[RESULT: JSON] ${JSON.stringify(parsedResults)}\n`);
      } catch (err) {
        console.error('Error parsing test results:', err);
      }
    }

    res.write(`\n> Execution finished with code ${code}\n`);
    res.end();
  });
});

function parsePlaywrightJson(data) {
  const results = [];
  let totalDuration = 0;

  function traverseSuites(suites) {
    if (!suites) return;

    suites.forEach(suite => {

      // Parse specs di suite sekarang
      if (suite.specs) {
        suite.specs.forEach(spec => {
          spec.tests.forEach(test => {
            const result = test.results[0];

            results.push({
              title: spec.title,
              status: result.status,
              duration: result.duration,
              error: result.errors?.length
                ? {
                    message: result.errors[0].message,
                    stack: result.errors[0].stack
                  }
                : null
            });

            totalDuration += result.duration;
          });
        });
      }

      // Recursive ke child suites
      if (suite.suites) {
        traverseSuites(suite.suites);
      }
    });
  }

  traverseSuites(data.suites);

  const stats = {
    total: results.length,
    passed: results.filter(r => r.status === 'passed').length,
    failed: results.filter(r => r.status === 'failed').length,
    skipped: results.filter(r => r.status === 'skipped').length,
    duration: totalDuration
  };

  return { stats, tests: results };
}

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
