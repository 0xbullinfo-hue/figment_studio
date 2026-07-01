/**
 * Configuration & Environment Validation
 * Ensures all required environment variables are present before server starts
 */

import process from 'process';

const ENV_REQUIRED = [
  'NODE_ENV',
  'PORT',
  'DATABASE_URL',
  'JWT_SECRET',
  'JWT_REFRESH_SECRET',
];

const ENV_OPTIONAL = {
  'PAYSTACK_SECRET_KEY': '',
  'FLUTTERWAVE_SECRET_KEY': '',
  'PAYSTACK_CHECKOUT_URL': '',
  'FLUTTERWAVE_CHECKOUT_URL': '',
  'GEMINI_API_KEY': '',
  'API_KEY': '',
  'ALLOWED_ORIGINS': 'http://localhost:3005,http://localhost:5173',
  'LOG_LEVEL': 'info',
  'AWS_REGION': 'us-east-1',
  'S3_BUCKET': '',
};

export function validateConfig() {
  const errors = [];
  const warnings = [];

  // Check required vars
  for (const key of ENV_REQUIRED) {
    if (!process.env[key]) {
      errors.push(`Missing required environment variable: ${key}`);
    }
  }

  // Warn on missing optional critical vars
  if (!process.env.PAYSTACK_SECRET_KEY && !process.env.FLUTTERWAVE_SECRET_KEY) {
    warnings.push('No payment provider secrets configured (PAYSTACK_SECRET_KEY, FLUTTERWAVE_SECRET_KEY)');
  }

  if (!process.env.S3_BUCKET && !process.env.STORAGE_PATH) {
    warnings.push('No file storage configured (S3_BUCKET or STORAGE_PATH)');
  }

  // Validate formats
  const port = parseInt(process.env.PORT || '0', 10);
  if (isNaN(port) || port < 1 || port > 65535) {
    errors.push(`Invalid PORT: must be 1-65535, got ${process.env.PORT}`);
  }

  if (process.env.NODE_ENV && !['development', 'staging', 'production'].includes(process.env.NODE_ENV)) {
    errors.push(`Invalid NODE_ENV: must be development|staging|production, got ${process.env.NODE_ENV}`);
  }

  if (process.env.DATABASE_URL && !process.env.DATABASE_URL.startsWith('postgres')) {
    warnings.push('DATABASE_URL does not start with postgres (expected PostgreSQL)');
  }

  if (process.env.JWT_SECRET && process.env.JWT_SECRET.length < 32) {
    errors.push('JWT_SECRET too short (min 32 chars)');
  }

  // Print results
  if (errors.length > 0) {
    console.error('\n❌ CONFIG VALIDATION FAILED:');
    errors.forEach(e => console.error(`   - ${e}`));
    console.error('\n');
    process.exit(1);
  }

  if (warnings.length > 0) {
    console.warn('\n⚠️  CONFIG WARNINGS:');
    warnings.forEach(w => console.warn(`   - ${w}`));
    console.warn('\n');
  }

  console.log('✅ Configuration validated');
}

export const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '8787', 10),
  databaseUrl: process.env.DATABASE_URL,
  jwt: {
    secret: process.env.JWT_SECRET,
    refreshSecret: process.env.JWT_REFRESH_SECRET,
    expiresIn: '7d',
    refreshExpiresIn: '30d',
  },
  payments: {
    paystack: {
      secretKey: process.env.PAYSTACK_SECRET_KEY,
      checkoutUrl: process.env.PAYSTACK_CHECKOUT_URL,
    },
    flutterwave: {
      secretKey: process.env.FLUTTERWAVE_SECRET_KEY,
      checkoutUrl: process.env.FLUTTERWAVE_CHECKOUT_URL,
    },
  },
  allowedOrigins: (process.env.ALLOWED_ORIGINS || 'http://localhost:3005').split(','),
  logLevel: process.env.LOG_LEVEL || 'info',
  ai: {
    geminiApiKey: process.env.GEMINI_API_KEY || process.env.API_KEY,
  },
  storage: {
    s3Bucket: process.env.S3_BUCKET,
    awsRegion: process.env.AWS_REGION || 'us-east-1',
  },
};

export default config;
