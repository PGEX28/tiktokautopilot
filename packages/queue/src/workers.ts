import { Worker, Job } from 'bullmq';
import { QueueName, logger } from '@autopilot/shared';
import { redisManager } from './connection.js';
import { RetryPolicy } from './retry.policy.js';

export type JobHandler<T = unknown, R = unknown> = (payload: T, job: Job) => Promise<R>;

export class WorkerService {
  private static instance: WorkerService;
  private workers: Map<QueueName, Worker> = new Map();
  private handlers: Map<QueueName, JobHandler> = new Map();

  private constructor() {}

  public static getInstance(): WorkerService {
    if (!WorkerService.instance) {
      WorkerService.instance = new WorkerService();
    }
    return WorkerService.instance;
  }

  public registerHandler<T, R>(queueName: QueueName, handler: JobHandler<T, R>): void {
    this.handlers.set(queueName, handler as JobHandler);
    logger.info(`Handler registered for queue [${queueName}]`);
  }

  public startWorker(queueName: QueueName, concurrency = 2): Worker | null {
    const handler = this.handlers.get(queueName);
    if (!handler) {
      logger.warn(`No handler registered for queue [${queueName}]. Worker not started.`);
      return null;
    }

    const connection = redisManager.getConnectionOptions();

    try {
      const worker = new Worker(
        queueName,
        async (job: Job) => {
          const startTime = Date.now();
          logger.info(`Processing job [${job.id}] on queue [${queueName}] (Attempt ${job.attemptsMade + 1})`);

          try {
            const result = await handler(job.data, job);
            const durationMs = Date.now() - startTime;
            logger.info(`Job [${job.id}] completed on queue [${queueName}] in ${durationMs}ms`);
            return result;
          } catch (error) {
            const durationMs = Date.now() - startTime;
            const currentAttempt = job.attemptsMade + 1;
            const maxAttempts = job.opts.attempts || 3;

            const decision = RetryPolicy.handleJobFailure(
              job.id || 'unknown',
              queueName,
              currentAttempt,
              error,
              maxAttempts
            );

            logger.error(`Job [${job.id}] failed on attempt ${currentAttempt}`, error, {
              durationMs,
              shouldRetry: decision.shouldRetry,
              isDeadLetter: decision.isDeadLetter,
            });

            throw error;
          }
        },
        {
          connection,
          concurrency,
        }
      );

      worker.on('failed', (job: Job | undefined, err: Error) => {
        logger.error(`Worker event: Job [${job?.id}] failed on queue [${queueName}]: ${err.message}`);
      });

      this.workers.set(queueName, worker);
      logger.info(`Worker started for queue [${queueName}] with concurrency=${concurrency}`);
      return worker;
    } catch (err) {
      logger.warn(`Could not start Redis worker for [${queueName}].`);
      return null;
    }
  }

  public async closeAll(): Promise<void> {
    for (const worker of this.workers.values()) {
      await worker.close();
    }
    this.workers.clear();
  }
}

export const workerService = WorkerService.getInstance();
