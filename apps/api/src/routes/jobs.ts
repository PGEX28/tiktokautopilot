import { Router, Request, Response, NextFunction } from 'express';
import { jobService } from '../services/job.service.js';

export const jobsRouter = Router();

// GET /api/v1/jobs - List background jobs
jobsRouter.get('/', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const jobs = await jobService.listJobs({
      status: req.query.status as string,
      limit: req.query.limit ? Number(req.query.limit) : 50,
    });
    res.json({ success: true, data: jobs });
  } catch (error) {
    next(error);
  }
});

// GET /api/v1/jobs/:id - Get single job details
jobsRouter.get('/:id', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const job = await jobService.getJobById(req.params.id as string);
    res.json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/jobs/:id/retry - Trigger manual retry
jobsRouter.post('/:id/retry', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const job = await jobService.retryJob(req.params.id as string);
    res.json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
});

// POST /api/v1/jobs/:id/cancel - Cancel running job
jobsRouter.post('/:id/cancel', async (req: Request, res: Response, next: NextFunction) => {
  try {
    const job = await jobService.cancelJob(req.params.id as string);
    res.json({ success: true, data: job });
  } catch (error) {
    next(error);
  }
});
