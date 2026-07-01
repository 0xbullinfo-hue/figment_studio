/**
 * Role-Based Access Control (RBAC) Middleware
 * Enforces user roles and permissions on backend endpoints
 * Frontend: This will be implemented in Phase 1 with JWT validation
 */

import { Request, Response, NextFunction } from 'express';
import { UnauthorizedError, ForbiddenError } from './errorHandler.ts';
import { logger } from '../logger.ts';

/**
 * For Phase 1+: Extract JWT from Authorization header
 * For now: This is a placeholder for frontend route guards
 */

export function requireAuth(req: Request, res: Response, next: NextFunction) {
  // TODO: Phase 1 - Implement JWT validation
  // const token = req.headers.authorization?.split(' ')[1];
  // if (!token) throw new UnauthorizedError('No token provided');
  // const user = jwt.verify(token, config.jwt.secret);
  // req.user = user;
  next();
}

export function requireRole(role: 'admin' | 'client' | 'any') {
  return (req: Request, res: Response, next: NextFunction) => {
    // TODO: Phase 1 - Check req.user.role
    // if (!req.user) throw new UnauthorizedError('Not authenticated');
    // if (role !== 'any' && req.user.role !== role) {
    //   logger.warn('Unauthorized access attempt', {
    //     userId: req.user.id,
    //     requiredRole: role,
    //     userRole: req.user.role,
    //     path: req.path,
    //     ip: req.ip,
    //   });
    //   throw new ForbiddenError('Insufficient permissions');
    // }
    next();
  };
}

export default requireAuth;
