import { Router } from 'express';
import { AppError } from '../middleware/errorHandler.js';
import { requireAuth, requireRole } from '../middleware/rbac.js';
import {
  createReceipt,
  getReceipt,
  listReceipts,
  updateReceiptStatus,
} from '../services/receipts.js';

export function createReceiptsRouter() {
  const router = Router();

  router.get('/', requireAuth, async (req, res, next) => {
    try {
      res.json({ ok: true, receipts: await listReceipts(req.user) });
    } catch (error) {
      next(error);
    }
  });

  router.get('/:invoiceId', requireAuth, async (req, res, next) => {
    try {
      const receipt = await getReceipt(req.params.invoiceId, req.user);
      if (!receipt) {
        throw new AppError('Receipt not found', 404, 'RECEIPT_NOT_FOUND');
      }
      res.json({ ok: true, receipt });
    } catch (error) {
      next(error);
    }
  });

  router.post('/', requireAuth, async (req, res, next) => {
    try {
      const payload = req.body || {};
      const invoiceId = String(payload.invoiceId || payload.id || '').trim();
      const project = String(payload.project || '').trim();
      if (!invoiceId || !project) {
        throw new AppError('Invoice ID and project are required', 400, 'INVALID_RECEIPT');
      }

      const receipt = await createReceipt({
        ...payload,
        invoiceId,
        project,
        clientName: payload.clientName || req.user?.name || 'Client User',
        status: req.user?.role === 'admin' ? payload.status : 'Pending',
      }, req.user);

      res.status(201).json({ ok: true, receipt });
    } catch (error) {
      next(error);
    }
  });

  router.patch('/:invoiceId/status', requireAuth, requireRole('admin'), async (req, res, next) => {
    try {
      const { status } = req.body || {};
      const receipt = await updateReceiptStatus(req.params.invoiceId, status);
      if (!receipt) {
        throw new AppError('Receipt not found', 404, 'RECEIPT_NOT_FOUND');
      }

      res.json({ ok: true, receipt });
    } catch (error) {
      next(error);
    }
  });

  return router;
}
