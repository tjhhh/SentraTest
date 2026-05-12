const { prisma } = require("../../config/prisma");

function createTestCase({ userId, conversationId, type, payload }) {
  return prisma.testCase.create({
    data: {
      userId,
      conversationId,
      type,
      payload,
    },
  });
}

module.exports = { createTestCase };
