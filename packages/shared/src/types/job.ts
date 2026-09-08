export type QueueName =
  | 'product-discovery'
  | 'product-analysis'
  | 'affiliate'
  | 'image-generation'
  | 'script-generation'
  | 'video-generation'
  | 'video-variation'
  | 'live-loop'
  | 'analytics'
  | 'optimization'
  | 'webhooks';

export type JobStatus = 'QUEUED' | 'RUNNING' | 'COMPLETED' | 'FAILED' | 'RETRYING' | 'CANCELLED';

export interface JobAttemptLog {
  attemptNumber: number;
  startedAt: string;
  failedAt?: string;
  errorMessage?: string;
  errorStack?: string;
  durationMs?: number;
}

export interface AutopilotJobData<T = Record<string, unknown>> {
  id: string;
  type: QueueName;
  status: JobStatus;
  priority: number; // 1 (highest) - 10 (lowest)
  attempts: number;
  maxAttempts: number;
  createdAt: string;
  startedAt?: string;
  completedAt?: string;
  failedAt?: string;
  error?: string;
  estimatedCostUsd?: number;
  actualCostUsd?: number;
  idempotencyKey: string;
  payload: T;
  logs: JobAttemptLog[];
  metadata?: Record<string, unknown>;
}
