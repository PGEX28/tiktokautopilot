import { Redis } from 'ioredis';
import { logger } from '@autopilot/shared';

export interface RedisConfig {
  host?: string;
  port?: number;
  password?: string;
  url?: string;
  enableOfflineQueue?: boolean;
}

export class RedisConnectionManager {
  private static instance: RedisConnectionManager;
  private client: Redis | null = null;
  private isConnected = false;

  private constructor() {}

  public static getInstance(): RedisConnectionManager {
    if (!RedisConnectionManager.instance) {
      RedisConnectionManager.instance = new RedisConnectionManager();
    }
    return RedisConnectionManager.instance;
  }

  public getConnectionOptions(): { host: string; port: number; password?: string; maxRetriesPerRequest: null } {
    const host = process.env.REDIS_HOST || '127.0.0.1';
    const port = parseInt(process.env.REDIS_PORT || '6379', 10);
    const password = process.env.REDIS_PASSWORD || undefined;

    return {
      host,
      port,
      password,
      maxRetriesPerRequest: null,
    };
  }

  public getClient(): Redis {
    if (!this.client) {
      const options = this.getConnectionOptions();
      this.client = new Redis({
        ...options,
        enableOfflineQueue: false,
        maxRetriesPerRequest: null,
        connectTimeout: 500,
        retryStrategy: () => null, // Fallback imediato para modo em memória sem espera
      });

      this.client.on('connect', () => {
        this.isConnected = true;
        logger.info('Redis connection established successfully');
      });

      this.client.on('error', (err: Error) => {
        this.isConnected = false;
        logger.warn(`Redis connection error (Operating in fallback mode): ${err.message}`);
      });
    }

    return this.client;
  }

  public async isHealthy(): Promise<boolean> {
    return this.isConnected;
  }

  public async close(): Promise<void> {
    if (this.client) {
      try {
        if (this.isConnected) {
          await this.client.quit();
        } else {
          this.client.disconnect();
        }
      } catch {
        // Ignorar erros ao fechar conexão offline
      }
      this.client = null;
      this.isConnected = false;
    }
  }
}

export const redisManager = RedisConnectionManager.getInstance();
