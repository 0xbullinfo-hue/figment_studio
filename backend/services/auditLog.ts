/**
 * Audit Logging Service
 * Records all critical operations (auth, payments, admin actions) for compliance
 */

import { logger } from '../logger.ts';

export interface AuditLogEntry {
  userId?: string;
  action: string;
  entityType?: string;
  entityId?: string;
  oldValues?: Record<string, any>;
  newValues?: Record<string, any>;
  status: 'success' | 'failed';
  errorMessage?: string;
  ipAddress?: string;
  userAgent?: string;
}

/**
 * Mock implementation using logger
 * TODO: Replace with database implementation in Phase 1
 */
export class AuditLogger {
  async log(entry: AuditLogEntry): Promise<void> {
    const logEntry = {
      timestamp: new Date().toISOString(),
      ...entry,
    };

    if (entry.status === 'success') {
      logger.info(`AUDIT: ${entry.action}`, logEntry);
    } else {
      logger.error(`AUDIT FAILED: ${entry.action}`, logEntry);
    }

    // TODO: Insert into audit_logs table
    // const query = `INSERT INTO audit_logs (...) VALUES (...)`;
    // await db.query(query, [...values]);
  }

  async logLogin(userId: string, success: boolean, ipAddress?: string, userAgent?: string): Promise<void> {
    await this.log({
      userId,
      action: 'USER_LOGIN',
      status: success ? 'success' : 'failed',
      errorMessage: success ? undefined : 'Login failed',
      ipAddress,
      userAgent,
    });
  }

  async logLogout(userId: string, ipAddress?: string): Promise<void> {
    await this.log({
      userId,
      action: 'USER_LOGOUT',
      status: 'success',
      ipAddress,
    });
  }

  async logPayment(
    userId: string,
    transactionId: string,
    amount: number,
    provider: string,
    success: boolean,
    ipAddress?: string
  ): Promise<void> {
    await this.log({
      userId,
      action: 'PAYMENT_INITIATED',
      entityType: 'payment_transaction',
      entityId: transactionId,
      newValues: { amount, provider },
      status: success ? 'success' : 'failed',
      ipAddress,
    });
  }

  async logSubscriptionChange(
    userId: string,
    oldPlan: string,
    newPlan: string,
    reason: string
  ): Promise<void> {
    await this.log({
      userId,
      action: 'SUBSCRIPTION_CHANGED',
      entityType: 'subscription',
      oldValues: { plan: oldPlan },
      newValues: { plan: newPlan, reason },
      status: 'success',
    });
  }

  async logAdminAction(
    userId: string,
    action: string,
    entityType: string,
    entityId: string,
    oldValues?: Record<string, any>,
    newValues?: Record<string, any>,
    ipAddress?: string
  ): Promise<void> {
    await this.log({
      userId,
      action: `ADMIN_${action}`,
      entityType,
      entityId,
      oldValues,
      newValues,
      status: 'success',
      ipAddress,
    });
  }

  async logGalleryPublish(
    adminId: string,
    galleryItemId: string,
    title: string,
    ipAddress?: string
  ): Promise<void> {
    await this.log({
      userId: adminId,
      action: 'GALLERY_PUBLISHED',
      entityType: 'gallery_item',
      entityId: galleryItemId,
      newValues: { title },
      status: 'success',
      ipAddress,
    });
  }

  async logArcvizRender(
    userId: string,
    renderId: string,
    renderParams: Record<string, any>,
    success: boolean,
    errorMessage?: string
  ): Promise<void> {
    await this.log({
      userId,
      action: 'ARCVIZ_RENDER',
      entityType: 'arcviz_render',
      entityId: renderId,
      newValues: renderParams,
      status: success ? 'success' : 'failed',
      errorMessage,
    });
  }
}

export const auditLogger = new AuditLogger();
export default auditLogger;
