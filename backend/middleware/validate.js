/**
 * Request validation middleware
 */

import { ValidationError } from './errorHandler.js';

function validateField(name, value, rule) {
  if (rule.required && (value === undefined || value === null || value === '')) {
    return `${name} is required`;
  }

  if (value === undefined || value === null || value === '') {
    return null;
  }

  if (rule.type === 'email') {
    const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailPattern.test(String(value))) {
      return `${name} must be a valid email`;
    }
    return null;
  }

  if (rule.type === 'number') {
    if (typeof value !== 'number' || Number.isNaN(value)) {
      return `${name} must be a number`;
    }
    if (rule.min !== undefined && value < rule.min) {
      return `${name} must be at least ${rule.min}`;
    }
    if (rule.max !== undefined && value > rule.max) {
      return `${name} must be at most ${rule.max}`;
    }
    return null;
  }

  if (rule.type === 'string') {
    if (typeof value !== 'string') {
      return `${name} must be a string`;
    }
    if (rule.min !== undefined && value.length < rule.min) {
      return `${name} must be at least ${rule.min} characters`;
    }
    if (rule.max !== undefined && value.length > rule.max) {
      return `${name} must be at most ${rule.max} characters`;
    }
    if (rule.enum && !rule.enum.includes(value)) {
      return `${name} must be one of: ${rule.enum.join(', ')}`;
    }
    return null;
  }

  return null;
}

export function validate(schema) {
  return (req, _res, next) => {
    const errors = [];
    for (const [name, rule] of Object.entries(schema)) {
      const error = validateField(name, req.body?.[name], rule);
      if (error) {
        errors.push(error);
      }
    }

    if (errors.length > 0) {
      next(new ValidationError('Validation failed', errors));
      return;
    }

    next();
  };
}
