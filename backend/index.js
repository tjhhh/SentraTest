const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const { spawn } = require('child_process');
const fs = require('fs');
const path = require('path');

require("./src/config/loadEnv");
const service = require("./src/modules/whitebox/whitebox.service");

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

app.post('/api/whitebox/generate', async (req, res) => {
  try {
    const { logicCode, uiCode, coverageType } = req.body;
    const data = await service.generateTestScript({ logicCode, uiCode, coverageType });
    res.json(data);
  } catch (error) {
    console.error('Error generating script:', error);
    res.status(500).json({ error: 'Failed to generate script', details: error.message });
  }
});

app.post('/api/whitebox/run', async (req, res) => {
  try {
    const result = await service.runTestScript(screenshotsDir);
    
    // For index.js, we keep the original expected output format for compatibility if needed,
    // or just return the JSON result. The frontend seems to handle both.
    // Based on the frontend code, it expects a stream.
    // To maintain streaming, we'd need to modify the service.
    // However, since the user is seeing a clean JSON, they might have switched to the new API.
    // For index.js, let's keep it simple and just return the result.
    
    res.json({
      success: true,
      data: {
        exitCode: result.exitCode,
        screenshots: result.screenshots,
        results: result.results,
      },
    });
  } catch (error) {
    console.error('Error running script:', error);
    res.status(500).json({ error: 'Failed to run script', details: error.message });
  }
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
