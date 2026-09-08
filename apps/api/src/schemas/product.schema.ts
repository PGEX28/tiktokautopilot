import { z } from 'zod';

export const ProductQuerySchema = z.object({
  category: z.string().optional(),
  minPrice: z.coerce.number().optional(),
  maxPrice: z.coerce.number().optional(),
  minCommissionRate: z.coerce.number().optional(),
  status: z.enum(['DISCOVERED', 'SCORED', 'APPROVED', 'REJECTED', 'IN_PRODUCTION', 'ARCHIVED']).optional(),
  limit: z.coerce.number().default(20),
  offset: z.coerce.number().default(0),
});

export const ProductActionSchema = z.object({
  action: z.enum(['APPROVE', 'REJECT']),
  reason: z.string().optional(),
});
