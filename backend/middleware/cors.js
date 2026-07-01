/**
 * Strict CORS middleware
 */

import { config } from '../config.js';
import { logger } from '../logger.js';

export function setupCors(app) {
  app.use((req, res, next) => {
    const origin = req.headers.origin;
    if (!origin) {
      next();
      return;
    }

    const allowed = config.allowedOrigins.includes(origin);
    if (!allowed) {
      logger.warn('Blocked CORS origin', { origin, path: req.path, ip: req.ip });
      res.status(403).json({ error: 'Origin not allowed', code: 'CORS_BLOCKED' });
      return;
    }

    res.header('Access-Control-Allow-Origin', origin);
    res.header('Vary', 'Origin');
    res.header('Access-Control-Allow-Credentials', 'true');
    res.header('Access-Control-Allow-Methods', 'GET,POST,PUT,PATCH,DELETE,OPTIONS');
    res.header('Access-Control-Allow-Headers', 'Content-Type, Authorization, X-Requested-With');

    if (req.method === 'OPTIONS') {
      res.sendStatus(204);
      return;
    }

    next();
  });
}
