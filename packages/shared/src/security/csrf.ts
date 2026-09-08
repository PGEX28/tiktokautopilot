import crypto from 'crypto';

export class CsrfStateManager {
  private static instance: CsrfStateManager;
  private validStates: Map<string, { createdAt: number; ttlMs: number; metadata?: Record<string, unknown> }> = new Map();

  private constructor() {
    setInterval(() => this.cleanup(), 60000);
  }

  public static getInstance(): CsrfStateManager {
    if (!CsrfStateManager.instance) {
      CsrfStateManager.instance = new CsrfStateManager();
    }
    return CsrfStateManager.instance;
  }

  /**
   * Gera um token de estado OAuth seguro de 32 bytes (64 caracteres hex)
   */
  public generateState(metadata?: Record<string, unknown>, ttlMs = 900000): string {
    const stateToken = crypto.randomBytes(32).toString('hex');
    this.validStates.set(stateToken, {
      createdAt: Date.now(),
      ttlMs, // 15 minutos padrão
      metadata,
    });
    return stateToken;
  }

  /**
   * Valida e consome o token de estado (Uso único)
   */
  public validateAndConsumeState(stateToken: string): { isValid: boolean; metadata?: Record<string, unknown> } {
    if (!stateToken) return { isValid: false };

    const record = this.validStates.get(stateToken);
    if (!record) return { isValid: false };

    // Remove para garantir uso único (Anti-Replay)
    this.validStates.delete(stateToken);

    const isExpired = Date.now() - record.createdAt > record.ttlMs;
    if (isExpired) return { isValid: false };

    return { isValid: true, metadata: record.metadata };
  }

  private cleanup(): void {
    const now = Date.now();
    for (const [key, val] of this.validStates.entries()) {
      if (now - val.createdAt > val.ttlMs) {
        this.validStates.delete(key);
      }
    }
  }
}

export const csrfStateManager = CsrfStateManager.getInstance();
