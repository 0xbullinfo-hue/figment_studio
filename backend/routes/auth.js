import { Router } from 'express';
import { AppError } from '../middleware/errorHandler.js';
import {
  getProfileFromPayload,
  loginUser,
  loginWithGoogleIdToken,
  refreshAccessToken,
  revokeRefreshTokensForUser,
  revokeRefreshToken,
  verifyAccessToken,
} from '../services/auth.js';
import { requireAuth } from '../middleware/rbac.js';

export function createAuthRouter({ authLimiter, validate }) {
  const router = Router();

  const loginSchema = {
    email: { type: 'email', required: true },
    password: { type: 'string', required: true, min: 8, max: 128 },
  };

  const refreshSchema = {
    refreshToken: { type: 'string', required: true, min: 20, max: 4096 },
  };

  const googleSchema = {
    idToken: { type: 'string', required: true, min: 50, max: 4096 },
  };

  router.post('/login', authLimiter, validate(loginSchema), async (req, res, next) => {
    try {
      const { email, password } = req.body;
      const session = await loginUser(email, password);
      if (!session) {
        throw new AppError('Invalid email or password', 401, 'INVALID_CREDENTIALS');
      }

      res.json({
        ok: true,
        user: session.user,
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
      });
    } catch (error) {
      next(error);
    }
  });

  router.post('/refresh', authLimiter, validate(refreshSchema), (req, res, next) => {
    try {
      const { refreshToken } = req.body;
      const refreshed = refreshAccessToken(refreshToken);
      if (!refreshed) {
        throw new AppError('Invalid refresh token', 401, 'INVALID_REFRESH_TOKEN');
      }

      res.json({ ok: true, ...refreshed });
    } catch (error) {
      next(error);
    }
  });

  router.post('/google', authLimiter, validate(googleSchema), async (req, res, next) => {
    try {
      const { idToken } = req.body;
      const session = await loginWithGoogleIdToken(idToken);
      if (!session) {
        throw new AppError('Invalid Google token', 401, 'INVALID_GOOGLE_TOKEN');
      }

      res.json({
        ok: true,
        user: session.user,
        accessToken: session.accessToken,
        refreshToken: session.refreshToken,
      });
    } catch (error) {
      next(new AppError('Google authentication failed', 401, 'GOOGLE_AUTH_FAILED'));
    }
  });

  router.post('/logout', authLimiter, (req, res) => {
    const { refreshToken } = req.body || {};
    if (refreshToken) {
      revokeRefreshToken(refreshToken);
    }

    const authorization = String(req.headers.authorization || '');
    const [scheme, token] = authorization.split(' ');
    if (scheme === 'Bearer' && token) {
      try {
        const payload = verifyAccessToken(token);
        if (payload?.sub) {
          revokeRefreshTokensForUser(payload.sub);
        }
      } catch {
        // Ignore invalid access tokens during logout.
      }
    }

    res.json({ ok: true });
  });

  router.get('/me', requireAuth, (req, res) => {
    const user = getProfileFromPayload(req.user);
    res.json({ ok: true, user });
  });

  return router;
}
