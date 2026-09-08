import { z } from 'zod';

export const GenerateContentSchema = z.object({
  productId: z.string().uuid(),
  targetVariationsCount: z.number().int().min(1).max(10).default(3),
  styles: z.array(z.enum(['curiosity', 'problem_solution', 'before_after', 'review', 'offer', 'demonstration'])).optional(),
});
