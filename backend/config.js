/**
 * Configuration & Environment Validation
 */

const REQUIRED_ENV = [
  'NODE_ENV',
  'PORT',
  'DATABASE_URL',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
];

export function validateConfig() {
  const errors = [];
  const warnings = [];

  for (const key of REQUIRED_ENV) {
    if (!process.env[key]) {
      errors.push(`Missing required environment variable: ${key}`);
    }
  }

  const port = Number.parseInt(process.env.PORT || '', 10);
  if (!Number.isInteger(port) || port < 1 || port > 65535) {
    errors.push(`Invalid PORT: ${process.env.PORT || '(empty)'}`);
  }

  if (process.env.NODE_ENV && !['development', 'staging', 'production'].includes(process.env.NODE_ENV)) {
    errors.push(`Invalid NODE_ENV: ${process.env.NODE_ENV}`);
  }

  if ((process.env.JWT_SECRET || '').length < 32) {
    errors.push('JWT_SECRET too short (minimum 32 characters)');
  }

  if ((process.env.JWT_REFRESH_SECRET || '').length < 32) {
    errors.push('JWT_REFRESH_SECRET too short (minimum 32 characters)');
  }

  if (!process.env.PAYSTACK_SECRET_KEY && !process.env.FLUTTERWAVE_SECRET_KEY) {
    warnings.push('No payment provider secret configured');
  }

  if (errors.length > 0) {
    const details = errors.map((entry) => ` - ${entry}`).join('\n');
    throw new Error(`Configuration validation failed:\n${details}`);
  }

  return warnings;
}

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: Number.parseInt(process.env.PORT || '8787', 10),
  databaseUrl: process.env.DATABASE_URL || '',
  jwt: {
    secret: process.env.JWT_SECRET || '',
    refreshSecret: process.env.JWT_REFRESH_SECRET || '',
    expiresIn: '7d',
    refreshExpiresIn: '30d',
  },
  payments: {
    paystack: {
      secretKey: process.env.PAYSTACK_SECRET_KEY || '',
      checkoutUrl: process.env.PAYSTACK_CHECKOUT_URL || '',
    },
    flutterwave: {
      secretKey: process.env.FLUTTERWAVE_SECRET_KEY || '',
      checkoutUrl: process.env.FLUTTERWAVE_CHECKOUT_URL || '',
      webhookHash: process.env.FLUTTERWAVE_WEBHOOK_HASH || '',
    },
  },
  frontendUrl: process.env.FRONTEND_URL || process.env.VITE_APP_URL || ((process.env.ALLOWED_ORIGINS || 'http://localhost:5173').split(',')[0] || 'http://localhost:5173').trim(),
  arcviz: {
    trialRenderLimit: Number.parseInt(process.env.TRIAL_RENDER_LIMIT || '4', 10),
  },
  google: {
    clientId: process.env.GOOGLE_CLIENT_ID || process.env.VITE_GOOGLE_CLIENT_ID || '',
  },
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3005,http://localhost:5173').split(',').map((value) => value.trim()).filter(Boolean),
  logLevel: process.env.LOG_LEVEL || 'info',
  ai: {
    geminiApiKey: process.env.GEMINI_API_KEY || process.env.API_KEY || '',
  },
  storage: {
    s3Bucket: process.env.S3_BUCKET || '',
    awsRegion: process.env.AWS_REGION || 'us-east-1',
  },
};
