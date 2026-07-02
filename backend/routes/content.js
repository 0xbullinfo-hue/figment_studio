import { Router } from 'express';
import { AppError } from '../middleware/errorHandler.js';
import { requireAuth, requireRole } from '../middleware/rbac.js';
import {
  addPortfolioItem,
  addProject,
  addReview,
  addService,
  deletePortfolioItem,
  deleteProject,
  deleteReview,
  deleteService,
  getAdminStudioSnapshot,
  getPublicStudioContent,
  restorePortfolioItem,
  restoreProject,
  restoreReview,
  updateAboutContent,
  updatePortfolioItem,
  updateProject,
  updateReview,
  updateService,
} from '../services/studioContent.js';

function parseIdParam(value) {
  return String(value || '').trim();
}

export function createContentRouter() {
  const router = Router();

  router.get('/public', (_req, res) => {
    res.json({ ok: true, ...getPublicStudioContent() });
  });

  router.get('/admin', requireAuth, requireRole('admin'), (_req, res) => {
    res.json({ ok: true, ...getAdminStudioSnapshot() });
  });

  router.put('/admin/about', requireAuth, requireRole('admin'), (req, res, next) => {
    try {
      const about = updateAboutContent(req.body || {});
      res.json({ ok: true, about });
    } catch (error) {
      next(error);
    }
  });

  router.post('/admin/services', requireAuth, requireRole('admin'), (req, res, next) => {
    try {
      const service = req.body || {};
      if (!service.id || !service.title) {
        throw new AppError('Service id and title are required', 400, 'INVALID_SERVICE');
      }
      res.json({ ok: true, services: addService(service) });
    } catch (error) {
      next(error);
    }
  });

  router.put('/admin/services/:id', requireAuth, requireRole('admin'), (req, res, next) => {
    try {
      const id = parseIdParam(req.params.id);
      if (!id) {
        throw new AppError('Service id is required', 400, 'INVALID_SERVICE');
      }
      const service = updateService({ ...req.body, id });
      res.json({ ok: true, services: service });
    } catch (error) {
      next(error);
    }
  });

  router.delete('/admin/services/:id', requireAuth, requireRole('admin'), (req, res, next) => {
    try {
      const id = parseIdParam(req.params.id);
      res.json({ ok: true, services: deleteService(id) });
    } catch (error) {
      next(error);
    }
  });

  router.post('/admin/projects', requireAuth, requireRole('admin'), (req, res, next) => {
    try {
      const project = req.body || {};
      if (!project.id || !project.title) {
        throw new AppError('Project id and title are required', 400, 'INVALID_PROJECT');
      }
      res.json({ ok: true, projects: addProject(project) });
    } catch (error) {
      next(error);
    }
  });

  router.put('/admin/projects/:id', requireAuth, requireRole('admin'), (req, res, next) => {
    try {
      const id = parseIdParam(req.params.id);
      if (!id) {
        throw new AppError('Project id is required', 400, 'INVALID_PROJECT');
      }
      res.json({ ok: true, projects: updateProject({ ...req.body, id }) });
    } catch (error) {
      next(error);
    }
  });

  router.delete('/admin/projects/:id', requireAuth, requireRole('admin'), (req, res, next) => {
    try {
      res.json({ ok: true, projects: deleteProject(parseIdParam(req.params.id)) });
    } catch (error) {
      next(error);
    }
  });

  router.post('/admin/projects/:id/restore', requireAuth, requireRole('admin'), (req, res, next) => {
    try {
      const project = req.body || {};
      if (!project.id) {
        throw new AppError('Project payload is required', 400, 'INVALID_PROJECT');
      }
      res.json({ ok: true, projects: restoreProject({ ...project, id: parseIdParam(req.params.id) || project.id }) });
    } catch (error) {
      next(error);
    }
  });

  router.post('/admin/portfolio', requireAuth, requireRole('admin'), (req, res, next) => {
    try {
      const item = req.body || {};
      if (item.id === undefined || !item.title) {
        throw new AppError('Portfolio id and title are required', 400, 'INVALID_PORTFOLIO_ITEM');
      }
      res.json({ ok: true, portfolioItems: addPortfolioItem(item) });
    } catch (error) {
      next(error);
    }
  });

  router.put('/admin/portfolio/:id', requireAuth, requireRole('admin'), (req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        throw new AppError('Portfolio id must be numeric', 400, 'INVALID_PORTFOLIO_ITEM');
      }
      res.json({ ok: true, portfolioItems: updatePortfolioItem({ ...req.body, id }) });
    } catch (error) {
      next(error);
    }
  });

  router.delete('/admin/portfolio/:id', requireAuth, requireRole('admin'), (req, res, next) => {
    try {
      const id = Number(req.params.id);
      if (Number.isNaN(id)) {
        throw new AppError('Portfolio id must be numeric', 400, 'INVALID_PORTFOLIO_ITEM');
      }
      res.json({ ok: true, portfolioItems: deletePortfolioItem(id) });
    } catch (error) {
      next(error);
    }
  });

  router.post('/admin/portfolio/:id/restore', requireAuth, requireRole('admin'), (req, res, next) => {
    try {
      const item = req.body || {};
      res.json({ ok: true, portfolioItems: restorePortfolioItem({ ...item, id: Number(req.params.id) || item.id }) });
    } catch (error) {
      next(error);
    }
  });

  router.post('/admin/reviews', requireAuth, requireRole('admin'), (req, res, next) => {
    try {
      const review = req.body || {};
      if (!review.id || !review.name) {
        throw new AppError('Review id and name are required', 400, 'INVALID_REVIEW');
      }
      res.json({ ok: true, reviews: addReview(review) });
    } catch (error) {
      next(error);
    }
  });

  router.put('/admin/reviews/:id', requireAuth, requireRole('admin'), (req, res, next) => {
    try {
      const id = parseIdParam(req.params.id);
      if (!id) {
        throw new AppError('Review id is required', 400, 'INVALID_REVIEW');
      }
      res.json({ ok: true, reviews: updateReview({ ...req.body, id }) });
    } catch (error) {
      next(error);
    }
  });

  router.delete('/admin/reviews/:id', requireAuth, requireRole('admin'), (req, res, next) => {
    try {
      res.json({ ok: true, reviews: deleteReview(parseIdParam(req.params.id)) });
    } catch (error) {
      next(error);
    }
  });

  router.post('/admin/reviews/:id/restore', requireAuth, requireRole('admin'), (req, res, next) => {
    try {
      const review = req.body || {};
      res.json({ ok: true, reviews: restoreReview({ ...review, id: parseIdParam(req.params.id) || review.id }) });
    } catch (error) {
      next(error);
    }
  });

  return router;
}