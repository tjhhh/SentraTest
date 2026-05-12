const { prisma } = require("../../config/prisma");

function createBugReport({ userId, stackTrace, analysis }) {
  return prisma.bugReport.create({
    data: { userId, stackTrace, analysis },
  });
}

module.exports = { createBugReport };
