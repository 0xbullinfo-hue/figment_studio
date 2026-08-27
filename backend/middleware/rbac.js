import { AppError } from './errorHandler.js';
import { verifyAccessToken } from '../services/auth.js';

export function requireAuth(req, _res, next) {
  try {
    const header = String(req.headers.authorization || '');
    const [scheme, token] = header.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new AppError('Missing or invalid authorization token', 401, 'UNAUTHORIZED');
    }

    const payload = verifyAccessToken(token);
    if (!payload || !payload.sub) {
      throw new AppError('Invalid token payload', 401, 'UNAUTHORIZED');
    }

    req.user = payload;
    next();
  } catch (_error) {
    next(new AppError('Unauthorized', 401, 'UNAUTHORIZED'));
  }
}

export function requireRole(role) {
  return (req, _res, next) => {
    const userRole = req.user?.role;
    if (!userRole) {
      next(new AppError('Unauthorized', 401, 'UNAUTHORIZED'));
      return;
    }

    if (role !== 'any' && userRole !== role) {
      next(new AppError('Forbidden', 403, 'FORBIDDEN'));
      return;
    }

    next();
  };
}
