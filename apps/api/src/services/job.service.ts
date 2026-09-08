import { AutopilotJobData, NotFoundError, logger } from '@autopilot/shared';
import { store } from './store.service.js';

export class JobService {
  async listJobs(filters?: { status?: string; limit?: number }): Promise<AutopilotJobData[]> {
    let jobs = Array.from(store.jobs.values());
    if (filters?.status) {
      jobs = jobs.filter((j) => j.status === filters.status);
    }
    const limit = filters?.limit || 50;
    return jobs.slice(0, limit);
  }

  async getJobById(jobId: string): Promise<AutopilotJobData> {
    const job = store.jobs.get(jobId);
    if (!job) {
      throw new NotFoundError('Job', jobId);
    }
    return job;
  }

  async retryJob(jobId: string): Promise<AutopilotJobData> {
    const job = await this.getJobById(jobId);
    job.status = 'QUEUED';
    job.attempts += 1;
    job.logs.push({
      attemptNumber: job.attempts,
      startedAt: new Date().toISOString(),
    });
    store.jobs.set(jobId, job);
    logger.info(`Manual retry triggered for job [${jobId}]`);
    return job;
  }

  async cancelJob(jobId: string): Promise<AutopilotJobData> {
    const job = await this.getJobById(jobId);
    job.status = 'CANCELLED';
    store.jobs.set(jobId, job);
    logger.warn(`Job [${jobId}] was cancelled manually`);
    return job;
  }
}

export const jobService = new JobService();
