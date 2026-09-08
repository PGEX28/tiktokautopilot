import { z } from 'zod';

export const UpdateBudgetSettingsSchema = z.object({
  maxVideosPerDay: z.number().int().min(1).max(100).optional(),
  maxVariationsPerProduct: z.number().int().min(1).max(10).optional(),
  maxDailyAiCostUsd: z.number().min(1).max(1000).optional(),
  maxMonthlyAiCostUsd: z.number().min(10).max(10000).optional(),
  minProductScoreAutopilot: z.number().min(0).max(100).optional(),
  autopilotEnabled: z.boolean().optional(),
  emergencyStop: z.boolean().optional(),
  allowedCategories: z.array(z.string()).optional(),
  blockedCategories: z.array(z.string()).optional(),
});
