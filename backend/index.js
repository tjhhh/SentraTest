const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { GoogleGenerativeAI } = require('@google/generative-ai');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

dotenv.config();

const app = express();
const port = process.env.PORT || 5000;

app.use(cors());
app.use(express.json());

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

      Include necessary imports and test cases that verify interactions (clicks, inputs) and assertions.
      Return ONLY the code for the test script, without any markdown formatting or explanations.

      Logic Code:
      ${logicCode}

      UI Code:
      ${uiCode || '<!-- No UI provided -->'}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let generatedScript = response.text();

    // Clean up markdown formatting if Gemini included it
    generatedScript = generatedScript.replace(/```javascript/g, '').replace(/```/g, '').trim();

    // Generate sandbox HTML
    const sandboxHTML = generateSandboxHTML(logicCode, uiCode);
    fs.writeFileSync(path.join(__dirname, 'sandbox.html'), sandboxHTML);

    // Write to a temporary file for execution
    const tempFilePath = path.join(__dirname, 'temp-test.spec.js');
    fs.writeFileSync(tempFilePath, generatedScript);

    res.json({ script: generatedScript });
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
  res.setHeader('Content-Type', 'text/plain');
  res.setHeader('Transfer-Encoding', 'chunked');

  const child = spawn('npx', ['playwright', 'test', 'temp-test.spec.js'], {
    shell: true
  });

  child.stdout.on('data', (data) => {
    res.write(data);
  });

  child.stderr.on('data', (data) => {
    res.write(data);
  });

  child.on('close', (code) => {
    res.write(`\n> Execution finished with code ${code}\n`);
    res.end();
  });
});

app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
});
