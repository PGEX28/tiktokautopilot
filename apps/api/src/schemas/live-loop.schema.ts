import { z } from 'zod';

export const CreateLiveLoopSchema = z.object({
  productId: z.string().uuid(),
  title: z.string().min(3).max(255),
  variationIdsOrder: z.array(z.string()).min(1),
  transitionType: z.enum(['NONE', 'FADE', 'SLIDE']).default('FADE'),
  transitionDurationSeconds: z.number().min(0).max(3).default(0.5),
  productCardOverlay: z.boolean().default(true),
  ctaTextOverlay: z.string().optional(),
});
