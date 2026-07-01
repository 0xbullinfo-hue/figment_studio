import { AppError } from './errorHandler.js';
import { verifyAccessToken } from '../services/auth.js';

export function requireAuth(req, _res, next) {
  try {
    const authorization = req.headers.authorization || '';
    const [scheme, token] = authorization.split(' ');

    if (scheme !== 'Bearer' || !token) {
      throw new AppError('Missing or invalid authorization token', 401, 'UNAUTHORIZED');
    }

    const payload = verifyAccessToken(token);
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
