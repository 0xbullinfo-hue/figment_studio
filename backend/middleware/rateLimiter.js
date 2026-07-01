/**
 * In-memory rate limiting
 */

import { logger } from '../logger.js';

class MemoryRateLimiter {
  constructor(maxRequests, windowMs) {
    this.maxRequests = maxRequests;
    this.windowMs = windowMs;
    this.store = new Map();
  }

  middleware = (req, res, next) => {
    const key = req.ip || 'unknown';
    const now = Date.now();
    const existing = this.store.get(key);

    if (!existing || existing.resetAt <= now) {
      this.store.set(key, { count: 1, resetAt: now + this.windowMs });
      next();
      return;
    }

    existing.count += 1;
    res.setHeader('X-RateLimit-Limit', String(this.maxRequests));
    res.setHeader('X-RateLimit-Remaining', String(Math.max(0, this.maxRequests - existing.count)));
    res.setHeader('X-RateLimit-Reset', String(existing.resetAt));

    if (existing.count > this.maxRequests) {
      const retryAfter = Math.ceil((existing.resetAt - now) / 1000);
      logger.warn('Rate limit exceeded', { ip: key, path: req.path, count: existing.count });
      res.setHeader('Retry-After', String(retryAfter));
      res.status(429).json({ error: 'Too many requests', retryAfter });
      return;
    }

    next();
  };
}

export function createRateLimiter(maxRequests, windowMs) {
  const limiter = new MemoryRateLimiter(maxRequests, windowMs);
  return limiter.middleware;
}

export const paymentLimiter = createRateLimiter(5, 60_000);
export const authLimiter = createRateLimiter(10, 60_000);
export const apiLimiter = createRateLimiter(100, 60_000);
