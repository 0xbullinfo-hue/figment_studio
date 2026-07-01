/**
 * Structured app errors and error handler
 */

import { logger } from '../logger.js';

export class AppError extends Error {
  constructor(message, statusCode = 500, code = 'INTERNAL_ERROR') {
    super(message);
    this.statusCode = statusCode;
    this.code = code;
  }
}

export class ValidationError extends AppError {
  constructor(message, errors = []) {
    super(message, 400, 'VALIDATION_ERROR');
    this.errors = errors;
  }
}

export function setupErrorHandler(app) {
  app.use((req, res) => {
    res.status(404).json({ error: 'Not found', code: 'NOT_FOUND', path: req.path });
  });

  app.use((error, req, res, _next) => {
    const statusCode = error.statusCode || 500;
    const code = error.code || 'INTERNAL_ERROR';

    logger.error(error.message || 'Unhandled error', {
      code,
      statusCode,
      path: req.path,
      method: req.method,
      stack: error.stack,
    });

    res.status(statusCode).json({
      error: error.message || 'Internal server error',
      code,
      ...(error.errors ? { errors: error.errors } : {}),
    });
  });
}
