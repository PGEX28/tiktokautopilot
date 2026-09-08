export interface BudgetSettings {
  maxVideosPerDay: number;
  maxVariationsPerProduct: number;
  maxDailyAiCostUsd: number;
  maxMonthlyAiCostUsd: number;
  currentDailySpendUsd: number;
  currentMonthlySpendUsd: number;
  autopilotEnabled: boolean;
  emergencyStop: boolean;
  minProductScoreAutopilot: number;
  allowedCategories: string[];
  blockedCategories: string[];
  updatedAt: string;
}

export interface BudgetCheckResult {
  isAllowed: boolean;
  reason?: string;
  currentDailySpend: number;
  maxDailySpend: number;
  currentMonthlySpend: number;
  maxMonthlySpend: number;
}
