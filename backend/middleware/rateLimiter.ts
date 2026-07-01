/**
 * Rate Limiting Middleware
 * Protects against abuse and DDoS
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../logger.ts';

interface RateLimitStore {
  [key: string]: { count: number; resetTime: number };
}

class RateLimiter {
  private store: RateLimitStore = {};
  private cleanupInterval: NodeJS.Timeout;

  constructor(private maxRequests: number = 100, private windowMs: number = 60000) {
    // Cleanup store every minute to prevent memory leaks
    this.cleanupInterval = setInterval(() => this.cleanup(), 60000);
  }

  private cleanup() {
    const now = Date.now();
    for (const [key, value] of Object.entries(this.store)) {
      if (value.resetTime < now) {
        delete this.store[key];
      }
    }
  }

  middleware(req: Request, res: Response, next: NextFunction) {
    const key = req.ip || 'unknown';
    const now = Date.now();

    if (!this.store[key] || this.store[key].resetTime < now) {
      this.store[key] = { count: 0, resetTime: now + this.windowMs };
    }

    this.store[key].count++;

    const remaining = Math.max(0, this.maxRequests - this.store[key].count);
    const retryAfter = Math.ceil((this.store[key].resetTime - now) / 1000);

    res.setHeader('X-RateLimit-Limit', this.maxRequests);
    res.setHeader('X-RateLimit-Remaining', remaining);
    res.setHeader('X-RateLimit-Reset', this.store[key].resetTime);

    if (this.store[key].count > this.maxRequests) {
      logger.warn('Rate limit exceeded', { ip: key, count: this.store[key].count });
      res.setHeader('Retry-After', retryAfter);
      return res.status(429).json({
        error: 'Too many requests',
        retryAfter,
      });
    }

    next();
  }

  destroy() {
    clearInterval(this.cleanupInterval);
  }
}

// Create limiters for different endpoints
export const createRateLimiter = (maxRequests: number, windowMs: number) => {
  const limiter = new RateLimiter(maxRequests, windowMs);
  return (req: Request, res: Response, next: NextFunction) => limiter.middleware(req, res, next);
};

// Specific limiters
export const paymentLimiter = createRateLimiter(5, 60000); // 5 per minute
export const authLimiter = createRateLimiter(10, 60000); // 10 per minute
export const apiLimiter = createRateLimiter(100, 60000); // 100 per minute
export const aiLimiter = createRateLimiter(20, 60000); // 20 per minute
