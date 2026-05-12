const { buildPrompt } = require("../../services/ai/promptOrchestrator.service");
const { generateText } = require("../../services/ai/gemini.service");
const { parseJsonSafe, normalizeGenerationOutput } = require("../../services/ai/outputParser.service");
const { createTestCase } = require("./whitebox.repository");
const { spawn } = require("child_process");
const fs = require("fs");
const path = require("path");
const { appLogger } = require("../../config/logger");
const { env } = require("../../config/env");

async function analyze({ userId, conversationId, coverageType, sourceCode, requestId }) {
  const prompt = buildPrompt({
    mode: "whitebox-analyze",
    input: sourceCode,
    method: coverageType,
  });

  const ai = await generateText(prompt, requestId);
  const parsed = parseJsonSafe(ai.text);
  const output = normalizeGenerationOutput("whitebox", parsed);

  await createTestCase({
    userId,
    conversationId,
    type: "WHITEBOX",
    coverageType,
    payload: output,
  });

  return output;
}

function script({ analysis }) {
  const scriptContent = `import { test } from '@playwright/test';\n\n` +
    `test('whitebox generated test', async ({ page }) => {\n` +
    `  console.log(${JSON.stringify(JSON.stringify(analysis))});\n` +
    `  await page.goto('http://localhost:3000');\n` +
    `});\n`;

  return { script: scriptContent };
}

async function generateTestScript({ logicCode, uiCode, coverageType, requestId = "wb-gen" }) {
  if (!logicCode) {
    throw new Error("Logic code is required");
  }

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
    ${uiCode || "<!-- No UI provided -->"}
  `;

  let generatedScript = "";
  let testTitles = [];

  try {
    const ai = await generateText(prompt, requestId);

    if (ai.provider === "fallback") {
      appLogger.warn("Gemini unavailable, using fallback whitebox script generation.", { requestId });
      ({ script: generatedScript, testTitles } = buildFallbackGeneration(logicCode, coverageType));
    } else {
      let textResult = ai.text;

      // More robust JSON extraction
      const jsonMatch = textResult.match(/\{[\s\S]*\}/);
      if (jsonMatch) {
        textResult = jsonMatch[0];
      }

      const parsed = JSON.parse(textResult);
      if (typeof parsed.script !== "string" || !Array.isArray(parsed.testTitles)) {
        throw new Error("Invalid Gemini response format: missing script or testTitles");
      }

      generatedScript = parsed.script;
      testTitles = parsed.testTitles;
    }
  } catch (error) {
    appLogger.error("Whitebox generation failed, using fallback script", {
      message: error instanceof Error ? error.message : String(error),
      requestId,
    });
    ({ script: generatedScript, testTitles } = buildFallbackGeneration(logicCode, coverageType));
  }

  // Generate sandbox HTML
  const sandboxHTML = generateSandboxHTML(logicCode, uiCode);
  const sandboxPath = path.join(__dirname, "sandbox.html");
  fs.writeFileSync(sandboxPath, sandboxHTML);

  // Write to a temporary file for execution
  const tempFilePath = path.join(__dirname, "temp-test.spec.js");
  fs.writeFileSync(tempFilePath, generatedScript);

  return { script: generatedScript, testTitles };
}

function buildFallbackGeneration(logicCode, coverageType) {
  const fallbackScript = `const { test, expect } = require('@playwright/test');\n` +
    `const path = require('path');\n\n` +
    `test('Fallback Whitebox - basic load (${coverageType || "branch"})', async ({ page }) => {\n` +
    `  await page.goto('file://' + path.join(__dirname, 'sandbox.html'));\n` +
    `  // Fallback mode: Gemini unavailable, run basic smoke validation.\n` +
    `  await expect(page.locator('body')).toBeVisible();\n` +
    `  await page.screenshot({ path: path.join(__dirname, 'screenshots', 'result-' + Date.now() + '.png') });\n` +
    `  console.log('[STEP: FALLBACK] Basic sandbox validation completed');\n` +
    `});\n`;

  const fallbackTitles = [
    `Fallback Whitebox - basic load (${coverageType || "branch"})`,
  ];

  return {
    script: fallbackScript,
    testTitles: fallbackTitles,
  };
}

function generateSandboxHTML(logic, ui) {
  let frameworkScripts = "";

  if (ui) {
    if (ui.includes("v-") || ui.includes("@click")) {
      frameworkScripts += '<script src="https://unpkg.com/vue@3/dist/vue.global.js"><\/script>\n';
    }
    if (ui.includes("React.") || ui.includes("jsx")) {
      frameworkScripts += '<script src="https://unpkg.com/react@18/umd/react.development.js"><\/script>\n';
      frameworkScripts += '<script src="https://unpkg.com/react-dom@18/umd/react-dom.development.js"><\/script>\n';
      frameworkScripts += '<script src="https://unpkg.com/@babel/standalone/babel.min.js"><\/script>\n';
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
    ${ui || ""}
</body>
</html>
  `;
}

async function runTestScript(screenshotsDirPath) {
  return new Promise((resolve, reject) => {
    const resultsPath = path.join(__dirname, "test-results.json");
    const testFilePath = path.join(__dirname, "temp-test.spec.js");
    const backendRoot = path.resolve(__dirname, "../../../");
    const relativeTestPath = path.relative(backendRoot, testFilePath);

    // Clean up old screenshots and results
    if (fs.existsSync(screenshotsDirPath)) {
      const files = fs.readdirSync(screenshotsDirPath);
      for (const file of files) {
        if (file.endsWith(".png")) {
          fs.unlinkSync(path.join(screenshotsDirPath, file));
        }
      }
    }

    if (fs.existsSync(resultsPath)) {
      fs.unlinkSync(resultsPath);
    }

    const normalizedPath = relativeTestPath.replace(/\\/g, "/");

    const child = spawn("npx", ["playwright", "test", normalizedPath, "--reporter=json,list"], {
      shell: true,
      cwd: backendRoot,
      env: { ...process.env, PLAYWRIGHT_JSON_OUTPUT_FILE: resultsPath },
    });

    let stdout = "";
    let stderr = "";

    child.stdout.on("data", (data) => {
      stdout += data.toString();
    });

    child.stderr.on("data", (data) => {
      stderr += data.toString();
    });

    child.on("close", (code) => {
      const newFiles = fs
        .readdirSync(screenshotsDirPath)
        .filter((f) => f.endsWith(".png"));

      let parsedResults = null;
      if (fs.existsSync(resultsPath)) {
        try {
          const rawResults = JSON.parse(fs.readFileSync(resultsPath, "utf8"));
          parsedResults = parsePlaywrightJson(rawResults);
        } catch (err) {
          console.error("Error parsing test results:", err);
        }
      }

      resolve({
        exitCode: code,
        stdout,
        stderr,
        screenshots: newFiles,
        results: parsedResults,
      });
    });
  });
}

function parsePlaywrightJson(data) {
  const results = [];
  let totalDuration = 0;

  function traverseSuites(suites) {
    if (!suites) return;

    suites.forEach((suite) => {
      if (suite.specs) {
        suite.specs.forEach((spec) => {
          spec.tests.forEach((test) => {
            const result = test.results[0];

            results.push({
              title: spec.title,
              status: result.status,
              duration: result.duration,
              error: result.errors?.length
                ? {
                    message: result.errors[0].message,
                    stack: result.errors[0].stack,
                  }
                : null,
            });

            totalDuration += result.duration;
          });
        });
      }

      if (suite.suites) {
        traverseSuites(suite.suites);
      }
    });
  }

  traverseSuites(data.suites);

  const stats = {
    total: results.length,
    passed: results.filter((r) => r.status === "passed").length,
    failed: results.filter((r) => r.status === "failed").length,
    skipped: results.filter((r) => r.status === "skipped").length,
    duration: totalDuration,
  };

  return { stats, tests: results };
}

module.exports = { analyze, script, generateTestScript, runTestScript };
