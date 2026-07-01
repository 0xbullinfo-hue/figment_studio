/**
 * Structured Logger
 * Centralizes all logging with consistent format, levels, and optional file output
 */

import fs from 'fs';
import path from 'path';

type LogLevel = 'debug' | 'info' | 'warn' | 'error';

const LEVELS = {
  debug: 0,
  info: 1,
  warn: 2,
  error: 3,
};

class Logger {
  private minLevel: number;
  private logDir: string;

  constructor(minLevel: LogLevel = 'info') {
    this.minLevel = LEVELS[minLevel];
    this.logDir = path.join(process.cwd(), 'logs');
    this.ensureLogDir();
  }

  private ensureLogDir() {
    if (!fs.existsSync(this.logDir)) {
      fs.mkdirSync(this.logDir, { recursive: true });
    }
  }

  private formatTime(): string {
    return new Date().toISOString();
  }

  private formatLog(level: LogLevel, message: string, meta?: Record<string, any>): string {
    const timestamp = this.formatTime();
    const metaStr = meta ? ` ${JSON.stringify(meta)}` : '';
    return `[${timestamp}] [${level.toUpperCase()}] ${message}${metaStr}`;
  }

  private writeToFile(level: LogLevel, message: string) {
    try {
      const filename = path.join(this.logDir, `${level}.log`);
      const line = this.formatLog(level, message) + '\n';
      fs.appendFileSync(filename, line, 'utf-8');
    } catch (e) {
      console.error('Failed to write log file:', e);
    }
  }

  private log(level: LogLevel, message: string, meta?: Record<string, any>) {
    if (LEVELS[level] < this.minLevel) return;

    const formatted = this.formatLog(level, message, meta);
    const color = {
      debug: '\x1b[36m',
      info: '\x1b[32m',
      warn: '\x1b[33m',
      error: '\x1b[31m',
      reset: '\x1b[0m',
    };

    console.log(`${color[level]}${formatted}${color.reset}`);
    this.writeToFile(level, message);
  }

  debug(message: string, meta?: Record<string, any>) {
    this.log('debug', message, meta);
  }

  info(message: string, meta?: Record<string, any>) {
    this.log('info', message, meta);
  }

  warn(message: string, meta?: Record<string, any>) {
    this.log('warn', message, meta);
  }

  error(message: string, meta?: Record<string, any>) {
    this.log('error', message, meta);
  }
}

export const logger = new Logger(process.env.LOG_LEVEL as LogLevel || 'info');

export default logger;
