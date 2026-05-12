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
  const { code, coverageType } = req.body;

  if (!code) {
    return res.status(400).json({ error: 'Code is required' });
  }

  try {
    const model = genAI.getGenerativeModel({ model: "gemini-flash-latest" });

    const prompt = `
      Analyze the following JavaScript code and generate a Playwright test script (.spec.js) that achieves ${coverageType} coverage.
      The test script should be valid JavaScript and use the @playwright/test library.
      Include necessary imports and test cases that verify the return values or behaviors of the code.
      Return ONLY the code for the test script, without any markdown formatting or explanations.

      Source Code:
      ${code}
    `;

    const result = await model.generateContent(prompt);
    const response = await result.response;
    let generatedScript = response.text();

    // Clean up markdown formatting if Gemini included it
    generatedScript = generatedScript.replace(/```javascript/g, '').replace(/```/g, '').trim();

    // Write to a temporary file for execution
    const tempFilePath = path.join(__dirname, 'temp-test.spec.js');
    fs.writeFileSync(tempFilePath, generatedScript);

    res.json({ script: generatedScript });
  } catch (error) {
    console.error('--- START ERROR DEBUG ---');
    console.error('Error generating script:', error.message);

    // MENGINTIP MODEL YANG TERSEDIA
    try {
      console.log('Mengecek daftar model yang tersedia untuk API Key ini...');
      const modelsList = await genAI.listModels();
      console.log('Daftar Model:');
      modelsList.models.forEach((m) => {
        console.log(`- ${m.name} (Methods: ${m.supportedGenerationMethods.join(', ')})`);
      });
    } catch (listError) {
      console.error('Gagal mengambil daftar model:', listError.message);
    }

    console.error('--- END ERROR DEBUG ---');
    
    res.status(500).json({ 
      error: 'Failed to generate script',
      details: error.message 
    });
  }
});

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

const server = app.listen(port, () => {
  console.log(`Backend listening at http://localhost:${port}`);
}).on('error', (err) => {
  console.error('SERVER ERROR:', err);
});

// Tambahkan ini di paling bawah file untuk tangkap error gak terduga
process.on('uncaughtException', (err) => {
  console.error('ADA ERROR TIDAK TERDUGA:', err);
  process.exit(1);
});