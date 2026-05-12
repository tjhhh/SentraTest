const { prisma } = require("../../config/prisma");

function createTestCase({ userId, conversationId, type, coverageType, payload }) {
  return prisma.testCase.create({
    data: {
      userId,
      conversationId,
      type,
      coverageType,
      payload,
    },
  });
}

module.exports = { createTestCase };
