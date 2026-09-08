import { z } from 'zod';

export const ScoreWeightsSchema = z.object({
  demand: z.number().min(0).max(1),
  viralPotential: z.number().min(0).max(1),
  commission: z.number().min(0).max(1),
  price: z.number().min(0).max(1),
  reviews: z.number().min(0).max(1),
  competition: z.number().min(0).max(1),
  demonstrability: z.number().min(0).max(1),
  impulseBuy: z.number().min(0).max(1),
}).refine(
  (w) => Math.abs(Object.values(w).reduce((a, b) => a + b, 0) - 1.0) < 0.001,
  { message: 'A soma dos pesos deve ser exatamente igual a 1.0 (100%)' }
);

export const RecalculateScoreSchema = z.object({
  customWeights: ScoreWeightsSchema.optional(),
});
