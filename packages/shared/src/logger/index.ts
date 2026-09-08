export type LogLevel = 'debug' | 'info' | 'warn' | 'error' | 'fatal';

export interface LogContext {
  agent?: string;
  jobId?: string;
  userId?: string;
  provider?: string;
  durationMs?: number;
  costUsd?: number;
  productId?: string;
  [key: string]: unknown;
}

const SENSITIVE_KEYS = ['password', 'token', 'secret', 'key', 'auth', 'cookie', 'authorization'];

function maskSecrets(obj: unknown): unknown {
  if (!obj || typeof obj !== 'object') return obj;
  if (Array.isArray(obj)) return obj.map(maskSecrets);

  const masked: Record<string, unknown> = {};
  for (const [k, v] of Object.entries(obj as Record<string, unknown>)) {
    const isSensitive = SENSITIVE_KEYS.some((s) => k.toLowerCase().includes(s));
    if (isSensitive && typeof v === 'string') {
      masked[k] = '***REDACTED***';
    } else if (typeof v === 'object' && v !== null) {
      masked[k] = maskSecrets(v);
    } else {
      masked[k] = v;
    }
  }
  return masked;
}

export class Logger {
  private serviceName: string;

  constructor(serviceName = 'autopilot') {
    this.serviceName = serviceName;
  }

  private formatMessage(level: LogLevel, message: string, context?: LogContext) {
    const entry = {
      timestamp: new Date().toISOString(),
      service: this.serviceName,
      level: level.toUpperCase(),
      message,
      ...(context ? { context: maskSecrets(context) } : {}),
    };

    if (process.env.NODE_ENV === 'production') {
      return JSON.stringify(entry);
    }

    const ctxStr = context && Object.keys(context).length > 0 ? ` | ctx=${JSON.stringify(maskSecrets(context))}` : '';
    return `[${entry.timestamp}] [${entry.level}] [${this.serviceName}]: ${message}${ctxStr}`;
  }

  debug(message: string, context?: LogContext): void {
    if (process.env.LOG_LEVEL === 'debug' || process.env.NODE_ENV === 'development') {
      console.debug(this.formatMessage('debug', message, context));
    }
  }

  info(message: string, context?: LogContext): void {
    console.info(this.formatMessage('info', message, context));
  }

  warn(message: string, context?: LogContext): void {
    console.warn(this.formatMessage('warn', message, context));
  }

  error(message: string, error?: Error | unknown, context?: LogContext): void {
    const errorDetails = error instanceof Error
      ? { errorMessage: error.message, errorStack: error.stack }
      : { errorDetails: error };

    console.error(
      this.formatMessage('error', message, {
        ...context,
        ...errorDetails,
      }),
    );
  }
}

export const logger = new Logger('autopilot-core');
