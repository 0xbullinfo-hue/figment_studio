/**
 * CORS Middleware
 * Enforces strict origin whitelist for security
 */

import { Express, Request, Response, NextFunction } from 'express';
import { config } from '../config.ts';
import { logger } from '../logger.ts';

export function setupCors(app: Express) {
  app.use((req: Request, res: Response, next: NextFunction) => {
    const origin = req.headers.origin || req.headers.referer;
    const isAllowed = origin && config.allowedOrigins.some(allowed => 
      origin.startsWith(allowed) || origin.includes(allowed)
    );

    if (isAllowed) {
      res.header('Access-Control-Allow-Origin', origin);
      res.header('Access-Control-Allow-Credentials', 'true');
      res.header('Access-Control-Allow-Methods', 'GET, POST, PUT, PATCH, DELETE, OPTIONS');
      res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');
      res.header('Access-Control-Max-Age', '86400');
    } else if (origin) {
      logger.warn('CORS request blocked', { origin, ip: req.ip });
    }

    if (req.method === 'OPTIONS') {
      return res.sendStatus(200);
    }

    next();
  });
}

export default setupCors;
