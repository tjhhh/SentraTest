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

function findLatestByConversationId(conversationId, type) {
  return prisma.testCase.findFirst({
    where: {
      conversationId,
      type,
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

module.exports = { createTestCase, findLatestByConversationId };
