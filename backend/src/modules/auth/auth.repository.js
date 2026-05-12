const { prisma } = require("../../config/prisma");

async function createUser({ email, passwordHash }) {
  return prisma.user.create({
    data: { email, passwordHash },
  });
}

async function getUserByEmail(email) {
  return prisma.user.findUnique({ where: { email } });
}

async function createRefreshToken({ userId, tokenHash, expiresAt }) {
  return prisma.refreshToken.create({
    data: { userId, tokenHash, expiresAt },
  });
}

async function revokeRefreshTokenByHash(tokenHash) {
  return prisma.refreshToken.updateMany({
    where: { tokenHash, isRevoked: false },
    data: { isRevoked: true, revokedAt: new Date() },
  });
}

async function getActiveRefreshToken(tokenHash) {
  return prisma.refreshToken.findFirst({
    where: {
      tokenHash,
      isRevoked: false,
      expiresAt: { gt: new Date() },
    },
    include: { user: true },
  });
}

module.exports = {
  createUser,
  getUserByEmail,
  createRefreshToken,
  revokeRefreshTokenByHash,
  getActiveRefreshToken,
};
