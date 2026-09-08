import { Router, Request, Response, NextFunction } from 'express';
import { scoreService } from '../services/score.service.js';
import { RecalculateScoreSchema } from '../schemas/score.schema.js';

export const scoresRouter = Router();

// GET /api/v1/scores/:productId - Get score breakdown for product
scoresRouter.get('/:productId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const score = await scoreService.getScoreByProductId(req.params.productId as string);
    res.json({ success: true, data: score });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/scores/:productId/recalculate - Recalculate score with optional custom weights
scoresRouter.post('/:productId/recalculate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = RecalculateScoreSchema.parse(req.body);
    const score = await scoreService.calculateScore(req.params.productId as string, body.customWeights);
    res.json({ success: true, data: score });
  } catch (error) {
    next(error);
  }
});
