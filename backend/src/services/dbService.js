const prisma = require("../lib/prisma");

async function saveBVATestCases(userId, requirementText, testCases) {
  const result = await prisma.bvaTestCase.create({
    data: {
      userId,
      requirementText,
      testCases,
    },
  });

  return result;
}

async function getBVAHistory(userId, limit = 10) {
  const result = await prisma.bvaTestCase.findMany({
    where: userId ? { userId } : {},
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
}

async function saveDecisionTable(userId, requirementText, decisionTable) {
  const result = await prisma.decisionTableCase.create({
    data: {
      userId,
      requirementText,
      decisionTable,
    },
  });

  return result;
}

async function getDecisionTableHistory(userId, limit = 10) {
  const result = await prisma.decisionTableCase.findMany({
    where: userId ? { userId } : {},
    take: limit,
    orderBy: {
      createdAt: "desc",
    },
  });

  return result;
}

module.exports = {
  saveBVATestCases,
  getBVAHistory,
  saveDecisionTable,
  getDecisionTableHistory,
};
