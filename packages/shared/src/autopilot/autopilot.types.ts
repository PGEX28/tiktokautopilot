export type AutopilotStatus = 'IDLE' | 'RUNNING' | 'PAUSED' | 'EMERGENCY_STOP' | 'ERROR';

export interface AutopilotLimits {
  dailyBudgetUsd: number;
  monthlyBudgetUsd: number;
  maxVideosPerDay: number;
  minProductScore: number;
  minCommissionRate: number;
}

export interface AutopilotCycleSummary {
  cycleId: string;
  startedAt: string;
  completedAt: string;
  status: 'SUCCESS' | 'STOPPED_BY_GUARD' | 'ERROR';
  productMined?: {
    id: string;
    title: string;
    score: number;
  };
  bundleGenerated?: {
    bundleId: string;
    totalCostUsd: number;
    variationsCount: number;
  };
  liveSessionStarted?: {
    sessionId: string;
    streamUrl: string;
  };
  totalCostIncurredUsd: number;
  logMessages: string[];
}
