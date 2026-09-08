import { AppError, logger } from '@autopilot/shared';

export interface RetryPolicyOptions {
  initialDelayMs: number;
  factor: number;
  maxDelayMs: number;
  maxAttempts: number;
}

export const DEFAULT_RETRY_POLICY: RetryPolicyOptions = {
  initialDelayMs: 2000,
  factor: 2,
  maxDelayMs: 60000,
  maxAttempts: 3,
};

export class RetryPolicy {
  public static isPermanentError(error: unknown): boolean {
    if (error instanceof AppError) {
      // If error is marked as not retryable (e.g. ValidationError, AuthError, NotSupportedByProvider)
      return !error.isRetryable;
    }

    if (error instanceof Error) {
      const msg = error.message.toLowerCase();
      if (
        msg.includes('validation') ||
        msg.includes('invalid_argument') ||
        msg.includes('unauthorized') ||
        msg.includes('forbidden') ||
        msg.includes('budget exceeded') ||
        msg.includes('emergency stop')
      ) {
        return true;
      }
    }

    return false;
  }

  public static calculateBackoff(attempt: number, policy: RetryPolicyOptions = DEFAULT_RETRY_POLICY): number {
    const delay = policy.initialDelayMs * Math.pow(policy.factor, attempt - 1);
    const cappedDelay = Math.min(delay, policy.maxDelayMs);
    // Add jitter (±10%) to prevent thundering herd
    const jitter = cappedDelay * 0.1 * (Math.random() * 2 - 1);
    return Math.round(cappedDelay + jitter);
  }

  public static handleJobFailure(
    jobId: string,
    queueName: string,
    currentAttempt: number,
    error: unknown,
    maxAttempts = 3
  ): { shouldRetry: boolean; nextDelayMs: number; isDeadLetter: boolean } {
    const permanent = this.isPermanentError(error);

    if (permanent) {
      logger.warn(`Job [${jobId}] on queue [${queueName}] failed with PERMANENT error. Moving to Dead-Letter.`, {
        error: error instanceof Error ? error.message : error,
      });
      return { shouldRetry: false, nextDelayMs: 0, isDeadLetter: true };
    }

    if (currentAttempt >= maxAttempts) {
      logger.error(`Job [${jobId}] on queue [${queueName}] exhausted all ${maxAttempts} attempts. Moving to Dead-Letter.`);
      return { shouldRetry: false, nextDelayMs: 0, isDeadLetter: true };
    }

    const nextDelayMs = this.calculateBackoff(currentAttempt);
    logger.info(`Job [${jobId}] on queue [${queueName}] scheduled for retry #${currentAttempt + 1} in ${nextDelayMs}ms`);
    return { shouldRetry: true, nextDelayMs, isDeadLetter: false };
  }
}
