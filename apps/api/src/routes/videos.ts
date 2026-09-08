import { Router, Request, Response, NextFunction } from 'express';
import { videoService } from '../services/video.service.js';

export const videosRouter = Router();

// GET /api/v1/videos/product/:productId - Get all generated variations for a product
videosRouter.get('/product/:productId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const variations = await videoService.getVariationsByProductId(req.params.productId as string);
    res.json({ success: true, data: variations });
  } catch (error) {
    next(error);
  }
});
