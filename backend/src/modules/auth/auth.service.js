const bcrypt = require("bcrypt");
const crypto = require("node:crypto");
const jwt = require("jsonwebtoken");

const { env } = require("../../config/env");
const {
  createUser,
  getUserByEmail,
  createRefreshToken,
  revokeRefreshTokenByHash,
  getActiveRefreshToken,
} = require("./auth.repository");

function signAccessToken(user) {
  return jwt.sign({ email: user.email }, env.JWT_ACCESS_SECRET, {
    subject: user.id,
    expiresIn: env.JWT_ACCESS_EXPIRES_IN,
  });
}

function signRefreshToken(user) {
  return jwt.sign({ type: "refresh" }, env.JWT_REFRESH_SECRET, {
    subject: user.id,
    expiresIn: env.JWT_REFRESH_EXPIRES_IN,
  });
}

function hashToken(token) {
  return crypto.createHash("sha256").update(token).digest("hex");
}

async function issueAuthTokens(user) {
  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);
  const decoded = jwt.decode(refreshToken);
  await createRefreshToken({
    userId: user.id,
    tokenHash: hashToken(refreshToken),
    expiresAt: new Date(decoded.exp * 1000),
  });

  return { accessToken, refreshToken };
}

async function register({ email, password }) {
  const existing = await getUserByEmail(email);
  if (existing) {
    const err = new Error("Email already registered");
    err.status = 409;
    throw err;
  }

  const passwordHash = await bcrypt.hash(password, 10);
  const user = await createUser({ email, passwordHash });
  const tokens = await issueAuthTokens(user);
  return { user: { id: user.id, email: user.email }, ...tokens };
}

async function login({ email, password }) {
  const user = await getUserByEmail(email);
  if (!user) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  const valid = await bcrypt.compare(password, user.passwordHash);
  if (!valid) {
    const err = new Error("Invalid credentials");
    err.status = 401;
    throw err;
  }

  const tokens = await issueAuthTokens(user);
  return { user: { id: user.id, email: user.email }, ...tokens };
}

async function refresh(refreshToken) {
  let payload;
  try {
    payload = jwt.verify(refreshToken, env.JWT_REFRESH_SECRET);
  } catch (error) {
    const err = new Error(`Invalid refresh token: ${error instanceof Error ? error.message : "verification failed"}`);
    err.status = 401;
    throw err;
  }

  const tokenHash = hashToken(refreshToken);
  const record = await getActiveRefreshToken(tokenHash);
  if (record?.userId !== payload.sub) {
    const err = new Error("Refresh token revoked or expired");
    err.status = 401;
    throw err;
  }

  await revokeRefreshTokenByHash(tokenHash);
  return issueAuthTokens(record.user);
}

async function logout(refreshToken) {
  const tokenHash = hashToken(refreshToken);
  await revokeRefreshTokenByHash(tokenHash);
}

module.exports = { register, login, refresh, logout };
