/**
 * Input Validation Middleware
 * Validates and sanitizes request payloads
 */

import { Request, Response, NextFunction } from 'express';
import { logger } from '../logger.ts';

export interface ValidationRule {
  type: 'string' | 'number' | 'boolean' | 'object' | 'array' | 'email' | 'uuid';
  required?: boolean;
  min?: number;
  max?: number;
  enum?: any[];
  pattern?: RegExp;
  allowEmpty?: boolean;
}

export interface ValidationSchema {
  [key: string]: ValidationRule;
}

function validateField(value: any, rule: ValidationRule, fieldName: string): string | null {
  // Check required
  if (rule.required && (value === undefined || value === null)) {
    return `${fieldName} is required`;
  }

  if (value === undefined || value === null) {
    return null;
  }

  // Type checking
  if (rule.type === 'email') {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(value)) {
      return `${fieldName} must be a valid email`;
    }
    return null;
  }

  if (rule.type === 'uuid') {
    const uuidRegex = /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i;
    if (!uuidRegex.test(value)) {
      return `${fieldName} must be a valid UUID`;
    }
    return null;
  }

  if (typeof value !== rule.type) {
    return `${fieldName} must be of type ${rule.type}, got ${typeof value}`;
  }

  // String checks
  if (rule.type === 'string') {
    if (!rule.allowEmpty && value === '') {
      return `${fieldName} cannot be empty`;
    }
    if (rule.min !== undefined && value.length < rule.min) {
      return `${fieldName} must be at least ${rule.min} characters`;
    }
    if (rule.max !== undefined && value.length > rule.max) {
      return `${fieldName} must be at most ${rule.max} characters`;
    }
    if (rule.pattern && !rule.pattern.test(value)) {
      return `${fieldName} does not match required pattern`;
    }
  }

  // Number checks
  if (rule.type === 'number') {
    if (rule.min !== undefined && value < rule.min) {
      return `${fieldName} must be at least ${rule.min}`;
    }
    if (rule.max !== undefined && value > rule.max) {
      return `${fieldName} must be at most ${rule.max}`;
    }
  }

  // Enum check
  if (rule.enum && !rule.enum.includes(value)) {
    return `${fieldName} must be one of: ${rule.enum.join(', ')}`;
  }

  return null;
}

export function validate(schema: ValidationSchema) {
  return (req: Request, res: Response, next: NextFunction) => {
    const errors: string[] = [];

    for (const [fieldName, rule] of Object.entries(schema)) {
      const value = req.body[fieldName];
      const error = validateField(value, rule, fieldName);
      if (error) {
        errors.push(error);
      }
    }

    if (errors.length > 0) {
      logger.warn('Validation failed', { path: req.path, errors, ip: req.ip });
      return res.status(400).json({
        error: 'Validation failed',
        errors,
      });
    }

    next();
  };
}

export default validate;
