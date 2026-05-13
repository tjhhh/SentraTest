const { successResponse } = require("../../utils/response");
const service = require("./whitebox.service");
const fs = require("fs");
const path = require("path");

async function analyze(req, res, next) {
  try {
    const data = await service.analyze({
      userId: req.user.id,
      conversationId: req.body.conversationId,
      coverageType: req.body.coverageType,
      sourceCode: req.body.sourceCode,
      requestId: req.requestId,
    });

    return successResponse(res, data);
  } catch (error) {
    return next(error);
  }
}

async function script(req, res, next) {
  try {
    const data = await service.script({ analysis: req.body.analysis });
    return successResponse(res, data);
  } catch (error) {
    return next(error);
  }
}

async function generate(req, res, next) {
  try {
    const { logicCode, uiCode, coverageType, conversationId } = req.body;
    
    if (!req.user?.id) {
      const err = new Error("Authentication required to generate test cases");
      err.status = 401;
      return next(err);
    }
    
    const userId = req.user.id;

    const data = await service.generateTestScript({
      logicCode,
      uiCode,
      coverageType,
    });

    if (data.refusal) {
      return successResponse(res, data);
    }

    // Persist or Update TestCase
    const testCase = await service.saveTestCase({
      userId,
      conversationId,
      coverageType: coverageType.toUpperCase(),
      logicCode,
      uiCode,
      generatedScript: data.script,
      testTitles: data.testTitles,
    });

    return successResponse(res, {
      ...data,
      testCaseId: testCase.id,
    });
  } catch (error) {
    return next(error);
  }
}

async function run(req, res, next) {
  try {
    const { testCaseId } = req.body;
    const screenshotsDir = path.join(__dirname, "../../screenshots");

    // Ensure screenshots directory exists
    if (!fs.existsSync(screenshotsDir)) {
      fs.mkdirSync(screenshotsDir, { recursive: true });
    }

    // Set headers for streaming
    res.setHeader("Content-Type", "text/plain");
    res.setHeader("Transfer-Encoding", "chunked");

    const result = await service.runTestScript(screenshotsDir, (chunk) => {
      res.write(chunk);
    });

    // Persist Execution if testCaseId is provided
    if (testCaseId && result.results) {
      await service.saveExecution({
        testCaseId,
        stats: result.results.stats,
        results: result.results.tests,
        screenshots: result.screenshots,
        exitCode: result.exitCode,
      });
    }

    // Send screenshots log marker for frontend gallery
    if (result.screenshots && result.screenshots.length > 0) {
      res.write(`\n[EVIDENCE: SCREENSHOTS] ${result.screenshots.join(",")}\n`);
    }

    // Send final result marker
    const finalResult = {
      success: true,
      data: {
        exitCode: result.exitCode,
        screenshots: result.screenshots,
        results: result.results,
      },
    };

    res.write(`\n[RESULT: JSON] ${JSON.stringify(finalResult)}\n`);
    res.end();
  } catch (error) {
    return next(error);
  }
}

module.exports = { analyze, script, generate, run };
