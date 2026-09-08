import { Router, Request, Response, NextFunction } from 'express';
import { ProductCandidate } from '@autopilot/shared';
import { productHunter } from '@autopilot/ai';
import { queueService } from '@autopilot/queue';
import { ProductQuerySchema } from '../schemas/product.schema.js';
import { store } from '../services/store.service.js';

export const hunterRouter = Router();

// GET /api/v1/hunter/candidates - Live search and filter product opportunities
hunterRouter.get('/candidates', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const query = ProductQuerySchema.parse(req.query);
    const result = await productHunter.findCandidates({
      category: query.category,
      minPrice: query.minPrice,
      maxPrice: query.maxPrice,
      minCommissionRate: query.minCommissionRate,
      limit: query.limit,
      offset: query.offset,
    });

    const structured = result.candidates.map((c: ProductCandidate) => productHunter.formatStructuredCandidate(c));

    res.json({
      success: true,
      data: structured,
      total: result.totalFound,
      source: result.source,
      timestamp: result.timestamp,
    });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/hunter/discover - Trigger asynchronous product discovery job in BullMQ
hunterRouter.post('/discover', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const { category, minCommissionRate, minPrice, maxPrice } = req.body as {
      category?: string;
      minCommissionRate?: number;
      minPrice?: number;
      maxPrice?: number;
    };

    const idempotencyKey = `discovery_${category || 'all'}_${new Date().toISOString().slice(0, 10)}`;

    const job = await queueService.dispatchJob(
      'product-discovery',
      {
        category,
        minCommissionRate,
        minPrice,
        maxPrice,
        requestedAt: new Date().toISOString(),
      },
      { idempotencyKey }
    );

    // Save job into API store
    store.jobs.set(job.id, job);

    res.json({
      success: true,
      message: 'Job de caça de produtos despachado para a fila assíncrona com sucesso.',
      data: {
        jobId: job.id,
        queue: 'product-discovery',
        status: job.status,
        idempotencyKey,
      },
    });
  } catch (error) {
    next(error);
  }
});
