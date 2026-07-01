import crypto from 'crypto';
import { config } from '../config.js';

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

export function hasProcessedWebhook(eventId) {
  if (!eventId) {
    return false;
  }
  return processedWebhookIds.has(String(eventId));
}

export function markWebhookProcessed(eventId) {
  if (!eventId) {
    return;
  }
  processedWebhookIds.add(String(eventId));
}
