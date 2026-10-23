import { z } from 'zod';

export const modelIdSchema = z.object({ modelId: z.string().uuid() });

export const createModelSchema = z.object({
  name: z.string().trim().min(1).max(160),
  description: z.string().trim().max(2000).nullable().optional(),
  image_url: z.string().url().max(2048).nullable().optional(),
  active: z.boolean().default(true),
}).strict();

export const updateModelSchema = createModelSchema.partial().strict()
  .refine((value) => Object.keys(value).length > 0, 'Incluye al menos un campo para actualizar.');
