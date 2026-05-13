const { prisma } = require("../../config/prisma");

async function getStats(userId) {
  const totalTestCases = await prisma.testCase.count({
    where: { userId },
  });

  const executions = await prisma.execution.findMany({
    where: { testCase: { userId } },
    select: { exitCode: true },
  });

  const totalRuns = executions.length;
  const successfulRuns = executions.filter((e) => e.exitCode === 0).length;
  const successRate = totalRuns > 0 ? (successfulRuns / totalRuns) * 100 : 0;

  // Mocking active projects and pending reviews for now as they aren't explicitly in schema yet
  return {
    totalTestCases,
    successRate: successRate.toFixed(1) + "%",
    pendingReviews: 0,
    activeProjects: 1, 
  };
}

async function getRecentExecutions(userId, limit = 10) {
  return prisma.execution.findMany({
    where: { testCase: { userId } },
    take: limit,
    orderBy: { createdAt: "desc" },
    include: {
      testCase: {
        select: {
          type: true,
          coverageType: true,
          payload: true,
        },
      },
    },
  });
}

module.exports = { getStats, getRecentExecutions };
