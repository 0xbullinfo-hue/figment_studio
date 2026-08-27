import crypto from 'crypto';
import { config } from '../config.js';
import { query } from '../db.js';
import { logger } from '../logger.js';

const processedWebhookIds = new Set();

function safeCompare(a, b) {
  const valueA = Buffer.from(String(a || ''), 'utf8');
  const valueB = Buffer.from(String(b || ''), 'utf8');

  if (valueA.length !== valueB.length) {
    return false;
  }

  return crypto.timingSafeEqual(valueA, valueB);
}

export function verifyWebhookSignature(provider, headers, rawBody) {
  if (provider === 'paystack') {
    const signature = headers['x-paystack-signature'];
    const secret = config.payments.paystack.secretKey;
    if (!signature || !secret || !rawBody) {
      return false;
    }

    const expected = crypto.createHmac('sha512', secret).update(rawBody).digest('hex');
    return safeCompare(signature, expected);
  }

  if (provider === 'flutterwave') {
    const signature = headers['verif-hash'] || headers['x-flutterwave-signature'];
    const hash = config.payments.flutterwave.webhookHash;
    if (!signature || !hash) {
      return false;
    }

    return safeCompare(signature, hash);
  }

  return false;
}

export function getWebhookEventId(provider, payload) {
  if (provider === 'paystack') {
    return payload?.data?.reference || payload?.data?.id || payload?.event;
  }

  if (provider === 'flutterwave') {
    return payload?.data?.id || payload?.data?.tx_ref || payload?.tx_ref;
  }

  return null;
}

export async function hasProcessedWebhook(eventId) {
  if (!eventId) {
    return false;
  }
  const idStr = String(eventId);
  if (processedWebhookIds.has(idStr)) {
    return true;
  }
  try {
    const result = await query('SELECT 1 FROM processed_webhooks WHERE event_id = $1', [idStr]);
    if (result && result.rowCount > 0) {
      processedWebhookIds.add(idStr);
      return true;
    }
  } catch (err) {
    logger.warn('Failed to query processed_webhooks from database, using memory cache', { error: err.message });
  }
  return false;
}

export async function markWebhookProcessed(eventId, provider = 'unknown') {
  if (!eventId) {
    return;
  }
  const idStr = String(eventId);
  processedWebhookIds.add(idStr);
  try {
    await query(
      'INSERT INTO processed_webhooks (event_id, provider) VALUES ($1, $2) ON CONFLICT (event_id) DO NOTHING',
      [idStr, provider]
    );
  } catch (err) {
    logger.warn('Failed to persist processed_webhook to database', { error: err.message });
  }
}

