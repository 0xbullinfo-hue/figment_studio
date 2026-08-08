import { Router } from 'express';
import { AppError } from '../middleware/errorHandler.js';
import { requireAuth } from '../middleware/rbac.js';
import { consumeArcvizRender, getArcvizQuota } from '../services/arcviz.js';
import { generateArchitecturalReply, generateVisionReply } from '../services/aiChat.js';

export function createArcvizRouter() {
  const router = Router();

  function validateChatPayload(payload) {
    const message = String(payload?.message || '').trim();
    if (!message) {
      throw new AppError('Message is required', 400, 'INVALID_CHAT_MESSAGE');
    }

    if (message.length > 8000) {
      throw new AppError('Message is too long', 400, 'INVALID_CHAT_MESSAGE');
    }

    const history = Array.isArray(payload?.history) ? payload.history : [];
    const boundedHistory = history.slice(-20).map((entry) => ({
      role: entry?.role === 'assistant' ? 'assistant' : 'user',
      content: String(entry?.content || '').slice(0, 4000),
    }));

    let image;
    if (payload?.image && typeof payload.image === 'object') {
      const mimeType = String(payload.image.mimeType || '');
      const data = String(payload.image.data || '');
      if (mimeType && data) {
        image = {
          mimeType,
          data,
        };
      }
    }

    return { message, history: boundedHistory, image };
  }

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

  router.post('/chat/vision', requireAuth, async (req, res, next) => {
    try {
      const user = req.user;
      if (!user?.sub) {
        throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
      }

      const payload = validateChatPayload(req.body || {});
      const reply = await generateVisionReply(payload);
      res.json({ ok: true, reply });
    } catch (error) {
      next(error);
    }
  });

  router.post('/chat/architectural', requireAuth, async (req, res, next) => {
    try {
      const user = req.user;
      if (!user?.sub) {
        throw new AppError('Unauthorized', 401, 'UNAUTHORIZED');
      }

      const payload = validateChatPayload(req.body || {});
      const reply = await generateArchitecturalReply(payload);
      res.json({ ok: true, reply });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
