import { Router, Request, Response, NextFunction } from 'express';
import { contentService } from '../services/content.service.js';
import { GenerateContentSchema } from '../schemas/content.schema.js';

export const contentRouter = Router();

// POST /api/v1/content/generate - Generate 5-stage scripts and content assets
contentRouter.post('/generate', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const body = GenerateContentSchema.parse(req.body);
    const result = await contentService.generateContentProject(
      body.productId,
      body.targetVariationsCount,
      body.styles
    );
    res.json({ success: true, data: result });
  } catch (error) {
    next(error);
  }
});
