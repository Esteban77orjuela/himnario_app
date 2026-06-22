const IS_DEV = __DEV__;

type LogLevel = 'info' | 'warn' | 'error';

const LOG_PREFIX = '[Himnario]';

function log(level: LogLevel, message: string, data?: unknown): void {
  if (!IS_DEV && level === 'info') return;

  const timestamp = new Date().toISOString().slice(11, 19);
  const prefix = `${timestamp} ${LOG_PREFIX}`;

  switch (level) {
    case 'info':
      console.log(`${prefix} ℹ️ ${message}`, data !== undefined ? data : '');
      break;
    case 'warn':
      console.warn(`${prefix} ⚠️ ${message}`, data !== undefined ? data : '');
      break;
    case 'error':
      console.error(`${prefix} 🔴 ${message}`, data !== undefined ? data : '');
      break;
  }
}

export const logger = {
  info: (message: string, data?: unknown) => log('info', message, data),
  warn: (message: string, data?: unknown) => log('warn', message, data),
  error: (message: string, data?: unknown) => log('error', message, data),
};

export function measureTime<T>(label: string, fn: () => T): T {
  if (!IS_DEV) return fn();
  const start = performance.now();
  const result = fn();
  const elapsed = performance.now() - start;
  if (elapsed > 16) {
    logger.warn(`${label} took ${elapsed.toFixed(1)}ms (exceeds 16ms frame budget)`);
  } else {
    logger.info(`${label} took ${elapsed.toFixed(1)}ms`);
  }
  return result;
}
