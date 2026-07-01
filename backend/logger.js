/**
 * Structured logger
 */

const LEVELS = {
  debug: 10,
  info: 20,
  warn: 30,
  error: 40,
};

class Logger {
  constructor(level = 'info') {
    this.level = LEVELS[level] ?? LEVELS.info;
  }

  write(level, message, meta) {
    if ((LEVELS[level] ?? LEVELS.info) < this.level) {
      return;
    }

    const payload = {
      timestamp: new Date().toISOString(),
      level,
      message,
      ...(meta ? { meta } : {}),
    };

    const line = JSON.stringify(payload);
    if (level === 'error') {
      console.error(line);
      return;
    }
    if (level === 'warn') {
      console.warn(line);
      return;
    }
    console.log(line);
  }

  debug(message, meta) {
    this.write('debug', message, meta);
  }

  info(message, meta) {
    this.write('info', message, meta);
  }

  warn(message, meta) {
    this.write('warn', message, meta);
  }

  error(message, meta) {
    this.write('error', message, meta);
  }
}

export const logger = new Logger(process.env.LOG_LEVEL || 'info');
