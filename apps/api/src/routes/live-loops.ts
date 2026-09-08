import { Router, Request, Response, NextFunction } from 'express';
import { videoService } from '../services/video.service.js';
import { CreateLiveLoopSchema } from '../schemas/live-loop.schema.js';

export const liveLoopsRouter = Router();

// GET /api/v1/live-loops/product/:productId - Get live loop config
liveLoopsRouter.get('/product/:productId', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const liveLoop = await videoService.getLiveLoopByProductId(req.params.productId as string);
    res.json({ success: true, data: liveLoop });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/live-loops - Create a new live stream loop
liveLoopsRouter.post('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = CreateLiveLoopSchema.parse(req.body);
    const liveLoop = await videoService.createLiveLoop(body);
    res.json({ success: true, data: liveLoop });
  } catch (error) {
    next(error);
  }
});
