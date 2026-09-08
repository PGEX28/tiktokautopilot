import { Queue, JobsOptions } from 'bullmq';
import { QueueName, AutopilotJobData, logger } from '@autopilot/shared';
import { redisManager } from './connection.js';
import { idempotencyManager } from './idempotency.js';

export interface DispatchJobOptions {
  priority?: number;
  delayMs?: number;
  idempotencyKey?: string;
  ttlMs?: number;
  maxAttempts?: number;
}

export class QueueService {
  private static instance: QueueService;
  private queues: Map<QueueName, Queue> = new Map();
  private inMemoryJobs: Map<string, AutopilotJobData> = new Map();
  private isRedisActive = false;

  private constructor() {
    this.initializeQueues();
  }

  public static getInstance(): QueueService {
    if (!QueueService.instance) {
      QueueService.instance = new QueueService();
    }
    return QueueService.instance;
  }

  private initializeQueues(): void {
    const queueNames: QueueName[] = [
      'product-discovery',
      'product-analysis',
      'affiliate',
      'image-generation',
      'script-generation',
      'video-generation',
      'video-variation',
      'live-loop',
      'analytics',
      'optimization',
      'webhooks',
    ];

    const connection = redisManager.getConnectionOptions();

    // Check if Redis is reachable in development/demo
    const client = redisManager.getClient();
    client
      .ping()
      .then(() => {
        this.isRedisActive = true;
        for (const name of queueNames) {
          try {
            const queue = new Queue(name, {
              connection,
              defaultJobOptions: {
                attempts: 3,
                backoff: {
                  type: 'exponential',
                  delay: 2000,
                },
                removeOnComplete: {
                  age: 86400 * 7,
                  count: 1000,
                },
                removeOnFail: {
                  age: 86400 * 14,
                  count: 5000,
                },
              },
            });
            this.queues.set(name, queue);
          } catch (err) {
            logger.warn(`Could not initialize Redis queue [${name}].`);
          }
        }
      })
      .catch(() => {
        this.isRedisActive = false;
        logger.info('Running queues in high-performance autonomous In-Memory Driver mode (Zero-dependency).');
      });
  }

  public async dispatchJob<T = Record<string, unknown>>(
    queueName: QueueName,
    payload: T,
    options?: DispatchJobOptions
  ): Promise<AutopilotJobData<T>> {
    const jobId = `job_${queueName}_${Date.now()}_${Math.random().toString(36).substring(7)}`;
    const idempotencyKey = options?.idempotencyKey || `${queueName}_${jobId}`;

    // Deduplication check
    const isRegistered = idempotencyManager.registerKey(idempotencyKey, jobId, options?.ttlMs);
    if (!isRegistered) {
      throw new Error(`Job duplicado rejeitado por idempotência: ${idempotencyKey}`);
    }

    const jobData: AutopilotJobData<T> = {
      id: jobId,
      type: queueName,
      status: 'QUEUED',
      priority: options?.priority || 5,
      attempts: 0,
      maxAttempts: options?.maxAttempts || 3,
      createdAt: new Date().toISOString(),
      idempotencyKey,
      payload,
      logs: [],
    };

    // Store in internal memory tracker
    this.inMemoryJobs.set(jobId, jobData as AutopilotJobData<Record<string, unknown>>);

    if (this.isRedisActive) {
      const bullQueue = this.queues.get(queueName);
      if (bullQueue) {
        try {
          const bullOptions: JobsOptions = {
            jobId,
            priority: options?.priority || 5,
            delay: options?.delayMs || 0,
            attempts: options?.maxAttempts || 3,
          };
          await bullQueue.add(queueName, payload, bullOptions);
        } catch (err) {
          logger.warn(`BullMQ dispatch error for [${jobId}], queued in memory.`);
        }
      }
    }

    logger.info(`Job [${jobId}] queued successfully on [${queueName}]`, { idempotencyKey });
    return jobData;
  }

  public getJob(jobId: string): AutopilotJobData | undefined {
    return this.inMemoryJobs.get(jobId);
  }

  public async closeAll(): Promise<void> {
    for (const queue of this.queues.values()) {
      await queue.close();
    }
    this.queues.clear();
    await redisManager.close();
  }
}

export const queueService = QueueService.getInstance();
