/**
 * FIGMENT STUDIO BACKEND - Production Ready
 * Phase 0: Foundation & Infrastructure
 * 
 * Startup sequence:
 * 1. Load environment & validate config
 * 2. Initialize logging
 * 3. Set up security middleware
 * 4. Mount routes
 * 5. Start server
 */

import express from 'express';
import dotenv from 'dotenv';
import { config, validateConfig } from './config.js';
import { logger } from './logger.js';
import { connectDatabase } from './db.js';
import { setupCors } from './middleware/cors.js';
import { paymentLimiter, authLimiter, apiLimiter } from './middleware/rateLimiter.js';
import { validate } from './middleware/validate.js';
import { setupErrorHandler, AppError, ValidationError } from './middleware/errorHandler.js';
import { createAuthRouter } from './routes/auth.js';
import { createArcvizRouter } from './routes/arcviz.js';
import { createPaymentIntent, getPaymentIntent, markPaymentCompleted } from './services/subscriptions.js';
import {
  getWebhookEventId,
  hasProcessedWebhook,
  markWebhookProcessed,
  verifyWebhookSignature,
} from './services/paymentSecurity.js';

// Load environment
dotenv.config();

// Validate configuration
validateConfig();

// Initialize Express
const app = express();

// ============================================================================
// MIDDLEWARE SETUP
// ============================================================================

// Body parser (must be before routes)
app.use(express.json({
  limit: '1mb',
  verify: (req, _res, buffer) => {
    req.rawBody = buffer.toString('utf8');
  },
}));
app.use(express.urlencoded({ limit: '1mb', extended: true }));

// Security: CORS
setupCors(app);

// Logging middleware
app.use((req, res, next) => {
  const start = Date.now();
  res.on('finish', () => {
    const duration = Date.now() - start;
    logger.debug(`${req.method} ${req.path}`, {
      statusCode: res.statusCode,
      duration: `${duration}ms`,
      ip: req.ip,
    });
  });
  next();
});

// ============================================================================
// HEALTH CHECK (No auth required)
// ============================================================================

app.get('/api/health', (_req, res) => {
  res.json({
    ok: true,
    service: 'figment-studio-backend',
    version: '0.2.0',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// ============================================================================
// CURRENCY & FX RATES (Rate limited, no auth)
// ============================================================================

const FX_RATES = {
  USD_NGN: Number(process.env.FX_USD_NGN || 1600),
};

app.get('/api/fx-rate', apiLimiter, (req, res, next) => {
  try {
    const base = String(req.query.base || 'USD').toUpperCase();
    const quote = String(req.query.quote || 'NGN').toUpperCase();

    if (!/^[A-Z]{3}$/.test(base) || !/^[A-Z]{3}$/.test(quote)) {
      throw new ValidationError('Invalid currency code', ['Currency codes must be 3 uppercase letters']);
    }

    if (base === quote) {
      return res.json({ base, quote, rate: 1, source: 'local-config' });
    }

    if (`${base}_${quote}` === 'USD_NGN') {
      return res.json({ base, quote, rate: FX_RATES.USD_NGN, source: 'local-config' });
    }

    if (`${base}_${quote}` === 'NGN_USD') {
      return res.json({ base, quote, rate: 1 / FX_RATES.USD_NGN, source: 'local-config' });
    }

    throw new AppError('Unsupported currency pair', 400, 'UNSUPPORTED_FX_PAIR');
  } catch (err) {
    next(err);
  }
});

// ============================================================================
// PAYMENT INITIALIZATION (Rate limited, validated)
// ============================================================================

const paymentInitSchema = {
  provider: {
    type: 'string',
    required: true,
    enum: ['paystack', 'flutterwave'],
  },
  amount: {
    type: 'number',
    required: true,
    min: 0.01,
    max: 1000000,
  },
  currency: {
    type: 'string',
    required: false,
    enum: ['USD', 'NGN'],
  },
  reference: {
    type: 'string',
    required: true,
    min: 1,
    max: 255,
  },
  project: {
    type: 'string',
    required: false,
    max: 255,
  },
  email: {
    type: 'email',
    required: false,
  },
};

app.post(
  '/api/payments/initialize',
  paymentLimiter,
  validate(paymentInitSchema),
  (req, res, next) => {
    try {
      const {
        provider = 'paystack',
        amount,
        currency = 'USD',
        reference,
        project = 'Architectural Project',
        email = 'client@figment.studio',
      } = req.body;

      const normalizedProvider = String(provider).toLowerCase();
      const providerUrl = config.payments[normalizedProvider]?.checkoutUrl;
      const paymentIntent = createPaymentIntent({
        reference,
        provider: normalizedProvider,
        amount: Number(amount),
        currency,
        project,
        email,
      });

      if (!providerUrl) {
        if (config.nodeEnv === 'production') {
          logger.warn('Payment provider URL not configured', {
            provider: normalizedProvider,
            ip: req.ip,
          });
          throw new AppError(
            'Payment provider not configured',
            503,
            'PROVIDER_NOT_CONFIGURED'
          );
        }

        const checkoutUrl = `${config.frontendUrl}/api/payments/mock-checkout/${encodeURIComponent(reference)}?provider=${encodeURIComponent(normalizedProvider)}&redirect=${encodeURIComponent(config.frontendUrl)}`;

        logger.info('Payment initialized in mock mode', {
          provider: normalizedProvider,
          reference,
          amount,
          currency,
        });

        return res.json({
          ok: true,
          provider: normalizedProvider,
          checkoutUrl,
          reference: paymentIntent.reference,
          mock: true,
        });
      }

      const params = new URLSearchParams({
        amount: String(amount),
        currency: String(currency),
        tx_ref: String(reference),
        project: String(project),
        customer_email: String(email),
      });

      const checkoutUrl = `${providerUrl}${providerUrl.includes('?') ? '&' : '?'}${params.toString()}`;

      logger.info('Payment initialized', {
        provider: normalizedProvider,
        reference,
        amount,
        currency,
      });

      res.json({
        ok: true,
        provider: normalizedProvider,
        checkoutUrl,
        reference: paymentIntent.reference,
      });
    } catch (err) {
      next(err);
    }
  }
);

app.get('/api/payments/mock-checkout/:reference', (req, res, next) => {
  try {
    if (config.nodeEnv === 'production') {
      throw new AppError('Mock checkout is disabled', 403, 'MOCK_CHECKOUT_DISABLED');
    }

    const reference = String(req.params.reference || '').trim();
    const intent = getPaymentIntent(reference);
    if (!intent) {
      throw new AppError('Payment reference not found', 404, 'PAYMENT_NOT_FOUND');
    }

    markPaymentCompleted(reference, {
      provider: intent.provider,
      source: 'mock-checkout',
    });

    const redirectTo = new URL('/success', config.frontendUrl);
    redirectTo.searchParams.set('invoiceId', reference);
    redirectTo.searchParams.set('amount', String(intent.amount));
    redirectTo.searchParams.set('project', intent.project);
    redirectTo.searchParams.set('paymentReference', reference);

    res.redirect(302, redirectTo.toString());
  } catch (err) {
    next(err);
  }
});

// ============================================================================
// PAYMENT WEBHOOKS (Rate limited, verified, idempotent)
// ============================================================================

app.post('/api/payments/webhook/:provider', paymentLimiter, (req, res, next) => {
  try {
    const provider = req.params.provider;
    const event = req.body;

    if (!provider || !['paystack', 'flutterwave'].includes(provider)) {
      throw new AppError('Invalid provider', 400, 'INVALID_PROVIDER');
    }

    const isValidSignature = verifyWebhookSignature(provider, req.headers, req.rawBody);
    if (!isValidSignature) {
      throw new AppError('Signature verification failed', 401, 'INVALID_SIGNATURE');
    }

    const eventId = getWebhookEventId(provider, event);
    if (eventId && hasProcessedWebhook(eventId)) {
      return res.json({ ok: true, duplicate: true });
    }

    logger.info(`Payment webhook received`, {
      provider,
      eventType: event.event || event.type,
      reference: event.reference || event.tx_ref,
    });

    const reference = String(event.reference || event.tx_ref || event.data?.reference || '').trim();
    const status = String(event.status || event.data?.status || event.event || event.type || '').toLowerCase();
    const looksSuccessful = ['successful', 'success', 'charge.success', 'charge.completed', 'payment.success'].some((value) => status.includes(value));

    if (reference && looksSuccessful) {
      markPaymentCompleted(reference, {
        provider,
        source: 'webhook',
        eventId,
      });
    }

    if (eventId) {
      markWebhookProcessed(eventId);
    }

    res.json({ ok: true, received: true });
  } catch (err) {
    next(err);
  }
});

app.use('/api/auth', createAuthRouter({ authLimiter, validate }));
app.use('/api/arcviz', createArcvizRouter());

// ============================================================================
// ERROR HANDLING (Must be last)
// ============================================================================

setupErrorHandler(app);

// ============================================================================
// START SERVER
// ============================================================================

async function startServer() {
  let dbConnected = false;
  try {
    await connectDatabase();
    dbConnected = true;
  } catch (error) {
    const allowDegradedMode = config.nodeEnv !== 'production';
    if (!allowDegradedMode) {
      throw error;
    }

    logger.warn('Database unavailable, starting in degraded mode', {
      error: error instanceof Error ? error.message : String(error),
    });
  }

  app.listen(config.port, () => {
    logger.info('Backend started', {
      port: config.port,
      environment: config.nodeEnv,
      dbConnected,
      allowedOrigins: config.allowedOrigins,
    });
  });
}

startServer().catch((error) => {
  logger.error('Failed to start backend', { error: error.message });
  process.exit(1);
});
