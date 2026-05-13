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

function findLatestByConversationId(conversationId) {
  return prisma.testCase.findFirst({
    where: {
      conversationId,
      type: {
        startsWith: "BLACKBOX_",
      },
    },
    orderBy: {
      createdAt: "desc",
    },
  });
}

module.exports = { createTestCase, findLatestByConversationId };
