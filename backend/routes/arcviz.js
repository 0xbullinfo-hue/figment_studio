import { Router } from 'express';
import { AppError } from '../middleware/errorHandler.js';
import { requireAuth } from '../middleware/rbac.js';
import { consumeArcvizRender, getArcvizQuota } from '../services/arcviz.js';

export function createArcvizRouter() {
  const router = Router();

  router.post('/render', requireAuth, (req, res, next) => {
    try {
      const user = req.user;
      if (!user?.sub) {
        throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
      }

      const quota = getArcvizQuota(user.plan, user.sub);
      if (!quota.allowed) {
        throw new AppError('Trial render limit reached', 403, 'TRIAL_LIMIT_REACHED');
      }

      const trialUsed = user.plan === 'pro' ? 0 : consumeArcvizRender(user.sub);
      const trialRemaining = user.plan === 'pro' ? Infinity : Math.max(0, quota.trialLimit - trialUsed);

      res.json({
        ok: true,
        allowed: true,
        plan: user.plan,
        trialLimit: quota.trialLimit,
        trialUsed,
        trialRemaining,
      });
    } catch (error) {
      next(error);
    }
  });

  router.get('/quota', requireAuth, (req, res, next) => {
    try {
      const user = req.user;
      if (!user?.sub) {
        throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
      }

      const quota = getArcvizQuota(user.plan, user.sub);
      res.json({ ok: true, ...quota });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
