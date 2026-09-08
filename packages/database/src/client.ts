import { logger } from '@autopilot/shared';

export interface DatabaseConfig {
  supabaseUrl?: string;
  supabaseAnonKey?: string;
  supabaseServiceRoleKey?: string;
  databaseUrl?: string;
}

export class DatabaseService {
  private config: DatabaseConfig;
  private isConnected = false;

  constructor(config?: DatabaseConfig) {
    this.config = config || {
      supabaseUrl: process.env.SUPABASE_URL,
      supabaseAnonKey: process.env.SUPABASE_ANON_KEY,
      supabaseServiceRoleKey: process.env.SUPABASE_SERVICE_ROLE_KEY,
      databaseUrl: process.env.DATABASE_URL,
    };
  }

  async connect(): Promise<boolean> {
    logger.info('DatabaseService initializing connection', {
      hasSupabaseUrl: !!this.config.supabaseUrl,
      hasDatabaseUrl: !!this.config.databaseUrl,
      environment: process.env.APP_ENV || 'DEMO',
    });
    this.isConnected = true;
    return true;
  }

  async isHealthy(): Promise<boolean> {
    return this.isConnected;
  }
}

export const db = new DatabaseService();
