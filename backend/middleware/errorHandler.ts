/**
 * Error Handler Middleware
 * Provides structured error responses with proper HTTP status codes
 */

import { Express, Request, Response, NextFunction } from 'express';
import { logger } from '../logger.ts';

export class AppError extends Error {
  constructor(
    public message: string,
    public statusCode: number = 500,
    public code: string = 'INTERNAL_ERROR'
  ) {
    super(message);
    Object.setPrototypeOf(this, AppError.prototype);
  }
}

export class ValidationError extends AppError {
  constructor(message: string, public errors: string[] = []) {
    super(message, 400, 'VALIDATION_ERROR');
  }
}

export class NotFoundError extends AppError {
  constructor(message: string = 'Resource not found') {
    super(message, 404, 'NOT_FOUND');
  }
}

export class UnauthorizedError extends AppError {
  constructor(message: string = 'Unauthorized') {
    super(message, 401, 'UNAUTHORIZED');
  }
}

export class ForbiddenError extends AppError {
  constructor(message: string = 'Forbidden') {
    super(message, 403, 'FORBIDDEN');
  }
}

export class ConflictError extends AppError {
  constructor(message: string = 'Conflict') {
    super(message, 409, 'CONFLICT');
  }
}

export function setupErrorHandler(app: Express) {
  // 404 handler
  app.use((req: Request, res: Response) => {
    return res.status(404).json({
      error: 'Not found',
      code: 'NOT_FOUND',
      path: req.path,
      method: req.method,
    });
  });

  // Error handler (must be last)
  app.use((err: Error | AppError, req: Request, res: Response, next: NextFunction) => {
    let statusCode = 500;
    let code = 'INTERNAL_ERROR';
    let message = 'Internal server error';
    let errors: string[] | undefined;

    if (err instanceof ValidationError) {
      statusCode = err.statusCode;
      code = err.code;
      message = err.message;
      errors = err.errors;
    } else if (err instanceof AppError) {
      statusCode = err.statusCode;
      code = err.code;
      message = err.message;
    } else if (err instanceof SyntaxError) {
      statusCode = 400;
      code = 'SYNTAX_ERROR';
      message = 'Invalid JSON';
    } else {
      message = err.message || 'Unknown error';
    }

    // Log error
    logger.error(`${code}: ${message}`, {
      path: req.path,
      method: req.method,
      ip: req.ip,
      statusCode,
      stack: err.stack,
    });

    // Send response
    const response: any = {
      error: message,
      code,
      statusCode,
    };

    if (errors) {
      response.errors = errors;
    }

    if (process.env.NODE_ENV === 'development') {
      response.stack = err.stack;
    }

    res.status(statusCode).json(response);
  });
}

export default setupErrorHandler;
