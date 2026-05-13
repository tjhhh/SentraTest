const { prisma } = require("../../config/prisma");

function createTestCase({ userId, conversationId, type, coverageType, payload, logicCode, uiCode, generatedScript }) {
  return prisma.testCase.create({
    data: {
      userId,
      conversationId,
      type,
      coverageType,
      payload,
      logicCode,
      uiCode,
      generatedScript,
    },
  });
}

function updateTestCase(id, { logicCode, uiCode, generatedScript, payload }) {
  return prisma.testCase.update({
    where: { id },
    data: {
      logicCode,
      uiCode,
      generatedScript,
      payload,
    },
  });
}

function createExecution({ testCaseId, stats, results, screenshots, exitCode }) {
  return prisma.execution.create({
    data: {
      testCaseId,
      stats,
      results,
      screenshots,
      exitCode,
    },
  });
}

module.exports = { createTestCase, updateTestCase, createExecution };
