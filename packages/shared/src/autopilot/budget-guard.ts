import { AutopilotLimits } from './autopilot.types.js';
import { logger } from '../logger/index.js';


export class BudgetGuard {
  private dailySpentUsd = 0;
  private monthlySpentUsd = 0;
  private emergencyStopTriggered = false;
  private limits: AutopilotLimits;

  constructor(limits?: Partial<AutopilotLimits>) {
    this.limits = {
      dailyBudgetUsd: limits?.dailyBudgetUsd || 15.00, // Limite diário de $15 USD
      monthlyBudgetUsd: limits?.monthlyBudgetUsd || 300.00, // Limite mensal de $300 USD
      maxVideosPerDay: limits?.maxVideosPerDay || 9,
      minProductScore: limits?.minProductScore || 80,
      minCommissionRate: limits?.minCommissionRate || 0.15,
    };
  }

  public triggerEmergencyStop(): void {
    this.emergencyStopTriggered = true;
    logger.warn('[BudgetGuard] 🚨 TRAVA DE EMERGÊNCIA ACIONADA! Todas as operações do Autopilot foram suspensas imediatamente.');
  }

  public releaseEmergencyStop(): void {
    this.emergencyStopTriggered = false;
    logger.info('[BudgetGuard] ✅ Trava de emergência desativada. Autopilot pronto para retomar.');
  }

  public isEmergencyStopActive(): boolean {
    return this.emergencyStopTriggered;
  }

  public canSpend(amountUsd: number): { allowed: boolean; reason?: string } {
    if (this.emergencyStopTriggered) {
      return { allowed: false, reason: 'EMERGENCY_STOP_ACTIVE' };
    }

    if (this.dailySpentUsd + amountUsd > this.limits.dailyBudgetUsd) {
      return { 
        allowed: false, 
        reason: `DAILY_BUDGET_EXCEEDED (Spent: $${this.dailySpentUsd.toFixed(2)}, Limit: $${this.limits.dailyBudgetUsd.toFixed(2)})` 
      };
    }

    if (this.monthlySpentUsd + amountUsd > this.limits.monthlyBudgetUsd) {
      return { 
        allowed: false, 
        reason: `MONTHLY_BUDGET_EXCEEDED (Spent: $${this.monthlySpentUsd.toFixed(2)}, Limit: $${this.limits.monthlyBudgetUsd.toFixed(2)})` 
      };
    }

    return { allowed: true };
  }

  public recordSpend(amountUsd: number): void {
    this.dailySpentUsd += amountUsd;
    this.monthlySpentUsd += amountUsd;
    logger.info(`[BudgetGuard] Recorded spend: $${amountUsd.toFixed(4)} (Today Total: $${this.dailySpentUsd.toFixed(4)})`);
  }

  public getStatus() {
    return {
      dailySpentUsd: Number(this.dailySpentUsd.toFixed(4)),
      monthlySpentUsd: Number(this.monthlySpentUsd.toFixed(4)),
      emergencyStopActive: this.emergencyStopTriggered,
      limits: this.limits,
    };
  }
}
