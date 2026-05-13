const { prisma } = require("../../config/prisma");

function createExportRecord({ userId, format, fileName, meta }) {
  return prisma.export.create({
    data: {
      userId,
      format,
      fileName,
      meta,
    },
  });
}

module.exports = { createExportRecord };
