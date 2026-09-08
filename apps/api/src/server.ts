import express, { Express, Request, Response, NextFunction } from 'express';
import cors from 'cors';
import { ZodError } from 'zod';
import { AppError, logger } from '@autopilot/shared';

import { healthRouter } from './routes/health.js';
import { productsRouter } from './routes/products.js';
import { scoresRouter } from './routes/scores.js';
import { contentRouter } from './routes/content.js';
import { videosRouter } from './routes/videos.js';
import { liveLoopsRouter } from './routes/live-loops.js';
import { analyticsRouter } from './routes/analytics.js';
import { jobsRouter } from './routes/jobs.js';
import { settingsRouter } from './routes/settings.js';
import { authRouter } from './routes/auth.js';
import { hunterRouter } from './routes/hunter.js';

import { securityHeadersMiddleware } from './middlewares/security-headers.middleware.js';
import { globalRateLimiter } from './middlewares/rate-limit.middleware.js';

export function createServer(): Express {
  const app = express();

  // Security Middlewares
  app.use(securityHeadersMiddleware);
  app.use(globalRateLimiter);

  app.use(cors({ origin: '*' }));
  app.use(express.json({ limit: '10mb' }));
  app.use(express.urlencoded({ extended: true }));

  // Request logger
  app.use((req: Request, _res: Response, next: NextFunction) => {
    logger.debug(`${req.method} ${req.url}`);
    next();
  });

  // Base API v1 routes
  app.use('/api/v1', healthRouter);
  app.use('/api/v1/hunter', hunterRouter);
  app.use('/api/v1/products', productsRouter);
  app.use('/api/v1/scores', scoresRouter);
  app.use('/api/v1/content', contentRouter);
  app.use('/api/v1/videos', videosRouter);
  app.use('/api/v1/live-loops', liveLoopsRouter);
  app.use('/api/v1/analytics', analyticsRouter);
  app.use('/api/v1/jobs', jobsRouter);
  app.use('/api/v1/settings', settingsRouter);
  app.use('/api/v1/auth', authRouter);

  // Global Error Handler
  app.use((err: Error, _req: Request, res: Response, _next: NextFunction) => {
    if (err instanceof ZodError) {
      return res.status(400).json({
        success: false,
        error: {
          name: 'ValidationError',
          message: 'Parâmetros ou payload de requisição inválidos',
          issues: err.errors.map((e) => ({
            field: e.path.join('.'),
            message: e.message,
          })),
        },
      });
    }

    if (err instanceof AppError) {
      logger.warn(`Handled application error: ${err.message}`, { statusCode: err.statusCode });
      return res.status(err.statusCode).json({
        success: false,
        error: {
          name: err.name,
          message: err.message,
          details: err.details,
        },
      });
    }

    logger.error('Unhandled server error', err);
    return res.status(500).json({
      success: false,
      error: {
        name: 'InternalServerError',
        message: 'Ocorreu um erro interno no servidor.',
      },
    });
  });

  return app;
}
