import { Request, Response, NextFunction } from 'express';
import { AppError } from '@autopilot/shared';

interface RateLimitRecord {
  count: number;
  resetTime: number;
}

export interface RateLimitOptions {
  windowMs?: number; // Janela de tempo (padrão: 1 minuto)
  maxRequests?: number; // Máximo de requisições por janela
  message?: string;
}

export function createRateLimiter(options?: RateLimitOptions) {
  const windowMs = options?.windowMs || 60000;
  const maxRequests = options?.maxRequests || 100;
  const message = options?.message || 'Muitas requisições. Limite de taxa excedido, tente novamente em breve.';

  const ipStore: Map<string, RateLimitRecord> = new Map();

  // Limpeza periódica de IPs inativos
  setInterval(() => {
    const now = Date.now();
    for (const [ip, record] of ipStore.entries()) {
      if (now > record.resetTime) {
        ipStore.delete(ip);
      }
    }
  }, windowMs);

  return (req: Request, res: Response, next: NextFunction): void => {
    const clientIp = (req.headers['x-forwarded-for'] as string) || req.socket.remoteAddress || '127.0.0.1';
    const now = Date.now();

    const record = ipStore.get(clientIp);

    if (!record || now > record.resetTime) {
      ipStore.set(clientIp, {
        count: 1,
        resetTime: now + windowMs,
      });
      res.setHeader('X-RateLimit-Limit', maxRequests);
      res.setHeader('X-RateLimit-Remaining', maxRequests - 1);
      return next();
    }

    if (record.count >= maxRequests) {
      const retryAfterSeconds = Math.ceil((record.resetTime - now) / 1000);
      res.setHeader('Retry-After', retryAfterSeconds);
      res.setHeader('X-RateLimit-Remaining', 0);
      return next(new AppError(message, 429, false, { retryAfterSeconds }));
    }

    record.count += 1;
    res.setHeader('X-RateLimit-Limit', maxRequests);
    res.setHeader('X-RateLimit-Remaining', Math.max(0, maxRequests - record.count));
    next();
  };
}

export const globalRateLimiter = createRateLimiter({
  windowMs: 60000,
  maxRequests: 300,
});
