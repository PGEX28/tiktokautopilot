import { Router, Request, Response } from 'express';

export const healthRouter = Router();

healthRouter.get('/health', (_req: Request, res: Response) => {
  res.json({
    status: 'HEALTHY',
    service: 'tiktok-shop-ai-autopilot-api',
    mode: process.env.APP_ENV || 'DEMO',
    timestamp: new Date().toISOString(),
    uptimeSeconds: Math.floor(process.uptime()),
    features: {
      autopilot: true,
      demoMode: (process.env.APP_ENV || 'DEMO') === 'DEMO',
      emergencyStop: process.env.AUTOPILOT_EMERGENCY_STOP === 'true',
    },
  });
});
