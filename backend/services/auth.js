import bcrypt from 'bcryptjs';
import jwt from 'jsonwebtoken';
import { randomUUID } from 'crypto';
import { OAuth2Client } from 'google-auth-library';
import { config } from '../config.js';
import { resolveEffectivePlan } from './subscriptions.js';

const refreshSessions = new Map();
const refreshSessionSweepIntervalMs = 60 * 60 * 1000;
const googleClient = new OAuth2Client();

function cleanupExpiredRefreshSessions() {
  const now = Date.now();

  for (const [token, session] of refreshSessions.entries()) {
    if (typeof session.expiresAt === 'number' && session.expiresAt <= now) {
      refreshSessions.delete(token);
    }
  }
}

const refreshSessionSweeper = setInterval(() => {
  cleanupExpiredRefreshSessions();
}, refreshSessionSweepIntervalMs);

if (typeof refreshSessionSweeper.unref === 'function') {
  refreshSessionSweeper.unref();
}

const seededUsers = [
  {
    id: 'admin-local',
    email: process.env.ADMIN_EMAIL || 'adminxfcs@figmentstudio.ng',
    name: 'Studio Admin',
    role: 'admin',
    plan: 'pro',
    passwordHash: bcrypt.hashSync(process.env.ADMIN_PASSWORD || 'AdminPass123!', 10),
  },
  {
    id: 'client-local',
    email: process.env.CLIENT_EMAIL || 'client@figmentstudio.ng',
    name: 'Client User',
    role: 'client',
    plan: 'trial',
    passwordHash: bcrypt.hashSync(process.env.CLIENT_PASSWORD || 'ClientPass123!', 10),
  },
];

function toUserProfile(user) {
  return {
    id: user.id,
    email: user.email,
    name: user.name,
    role: user.role,
    plan: resolveEffectivePlan(user),
  };
}

function signAccessToken(user) {
  const plan = resolveEffectivePlan(user);
  return jwt.sign(
    {
      sub: user.id,
      email: user.email,
      role: user.role,
      plan,
      name: user.name,
    },
    config.jwt.secret,
    { expiresIn: config.jwt.expiresIn }
  );
}

function signRefreshToken(user) {
  const token = jwt.sign(
    {
      sub: user.id,
      type: 'refresh',
      sessionId: randomUUID(),
    },
    config.jwt.refreshSecret,
    { expiresIn: config.jwt.refreshExpiresIn }
  );

  const decoded = jwt.decode(token);
  const expiresAt = typeof decoded?.exp === 'number' ? decoded.exp * 1000 : Date.now();

  refreshSessions.set(token, {
    userId: user.id,
    user: { ...user },
    createdAt: Date.now(),
    expiresAt,
  });

  return token;
}

export async function loginUser(email, password) {
  const normalizedEmail = String(email || '').trim().toLowerCase();
  const user = seededUsers.find((candidate) => candidate.email.toLowerCase() === normalizedEmail);

  if (!user) {
    return null;
  }

  const ok = await bcrypt.compare(String(password || ''), user.passwordHash);
  if (!ok) {
    return null;
  }

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  return {
    user: toUserProfile(user),
    accessToken,
    refreshToken,
  };
}

export async function loginWithGoogleIdToken(idToken) {
  if (!config.google.clientId) {
    throw new Error('Google login is not configured');
  }

  const ticket = await googleClient.verifyIdToken({
    idToken,
    audience: config.google.clientId,
  });

  const payload = ticket.getPayload();
  if (!payload?.email) {
    return null;
  }

  const email = String(payload.email).toLowerCase();
  const existingUser = seededUsers.find((candidate) => candidate.email.toLowerCase() === email);
  const fallbackRole = email === (process.env.ADMIN_EMAIL || '').toLowerCase() ? 'admin' : 'client';

  const user = existingUser || {
    id: `google-${payload.sub}`,
    email,
    name: payload.name || 'Google User',
    role: fallbackRole,
    plan: fallbackRole === 'admin' ? 'pro' : 'trial',
  };

  const accessToken = signAccessToken(user);
  const refreshToken = signRefreshToken(user);

  return {
    user: toUserProfile(user),
    accessToken,
    refreshToken,
  };
}

export function verifyAccessToken(token) {
  return jwt.verify(token, config.jwt.secret);
}

export function refreshAccessToken(refreshToken) {
  cleanupExpiredRefreshSessions();

  const session = refreshSessions.get(refreshToken);
  if (!session) {
    return null;
  }

  const decoded = jwt.verify(refreshToken, config.jwt.refreshSecret);
  const user = session.user || seededUsers.find((candidate) => candidate.id === decoded.sub);
  if (!user) {
    refreshSessions.delete(refreshToken);
    return null;
  }

  if (typeof session.expiresAt === 'number' && session.expiresAt <= Date.now()) {
    refreshSessions.delete(refreshToken);
    return null;
  }

  refreshSessions.delete(refreshToken);
  const nextRefreshToken = signRefreshToken(user);

  return {
    accessToken: signAccessToken(user),
    refreshToken: nextRefreshToken,
    user: toUserProfile(user),
  };
}

export function revokeRefreshToken(refreshToken) {
  refreshSessions.delete(refreshToken);
}

export function revokeRefreshTokensForUser(userId) {
  for (const [token, session] of refreshSessions.entries()) {
    if (session.userId === userId) {
      refreshSessions.delete(token);
    }
  }
}

export function getProfileFromPayload(payload) {
  return {
    id: payload.sub,
    email: payload.email,
    name: payload.name,
    role: payload.role,
    plan: resolveEffectivePlan(payload),
  };
}
