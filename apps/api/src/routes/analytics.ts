import { Router, Request, Response, NextFunction } from 'express';
import { analyticsService } from '../services/analytics.service.js';

export const analyticsRouter = Router();

// GET /api/v1/analytics/summary - Overall dashboard overview
analyticsRouter.get('/summary', async (_req: Request, res: Response, next: NextFunction) => {
  try {
    const summary = await analyticsService.getDashboardSummary();
    res.json({ success: true, data: summary });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/analytics/product/:productId - Video performance metrics
analyticsRouter.get('/product/:productId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const metrics = await analyticsService.getProductMetrics(req.params.productId as string);
    res.json({ success: true, data: metrics });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/insights/product/:productId - AI Optimization recommendations
analyticsRouter.get('/insights/product/:productId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const insight = await analyticsService.getProductInsights(req.params.productId as string);
    res.json({ success: true, data: insight });
  } catch (error) {
    next(error);
  }
});
