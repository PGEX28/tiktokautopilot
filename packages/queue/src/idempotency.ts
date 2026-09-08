import { logger } from '@autopilot/shared';

export class IdempotencyManager {
  private static instance: IdempotencyManager;
  private memoryStore: Map<string, { jobId: string; timestamp: number; ttlMs: number }> = new Map();

  private constructor() {
    // Periodically clean expired keys
    setInterval(() => this.cleanup(), 60000);
  }

  public static getInstance(): IdempotencyManager {
    if (!IdempotencyManager.instance) {
      IdempotencyManager.instance = new IdempotencyManager();
    }
    return IdempotencyManager.instance;
  }

  public registerKey(idempotencyKey: string, jobId: string, ttlMs = 3600000): boolean {
    const existing = this.memoryStore.get(idempotencyKey);
    const now = Date.now();

    if (existing && now - existing.timestamp < existing.ttlMs) {
      logger.warn(`Duplicate job prevented by idempotency key: ${idempotencyKey}`, {
        existingJobId: existing.jobId,
        attemptedJobId: jobId,
      });
      return false; // Key already active, job is duplicate
    }

    this.memoryStore.set(idempotencyKey, { jobId, timestamp: now, ttlMs });
    return true; // Successfully registered
  }

  public isDuplicate(idempotencyKey: string): boolean {
    const existing = this.memoryStore.get(idempotencyKey);
    if (!existing) return false;
    return Date.now() - existing.timestamp < existing.ttlMs;
  }

  public releaseKey(idempotencyKey: string): void {
    this.memoryStore.delete(idempotencyKey);
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, record] of this.memoryStore.entries()) {
      if (now - record.timestamp >= record.ttlMs) {
        this.memoryStore.delete(key);
      }
    }
  }
}

export const idempotencyManager = IdempotencyManager.getInstance();
