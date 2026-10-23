import { z } from 'zod';

export const packageIdSchema = z.object({ packageId: z.string().uuid() });

export const createPackageSchema = z.object({
  name: z.string().trim().min(1).max(160),
  description: z.string().trim().max(2000).nullable().optional(),
  price: z.number().finite().min(0),
  currency: z.string().regex(/^[A-Z]{3}$/).default('USD'),
  features: z.array(z.string().trim().min(1).max(300)).max(50).default([]),
  active: z.boolean().default(true),
}).strict();

export const updatePackageSchema = createPackageSchema.partial().strict()
  .refine((value) => Object.keys(value).length > 0, 'Incluye al menos un campo para actualizar.');
