import { z } from 'zod';

const optionalText = z.string().trim().max(2000).nullable();

export const brandIdSchema = z.object({ brandId: z.string().uuid() });

export const createBrandSchema = z.object({
  owner_profile_id: z.string().uuid(),
  name: z.string().trim().min(1).max(160),
  description: optionalText.optional(),
  website: z.string().url().max(2048).nullable().optional(),
}).strict();

export const updateBrandSchema = z.object({
  owner_profile_id: z.string().uuid().optional(),
  name: z.string().trim().min(1).max(160).optional(),
  description: optionalText.optional(),
  website: z.string().url().max(2048).nullable().optional(),
}).strict().refine((value) => Object.keys(value).length > 0, 'Incluye al menos un campo para actualizar.');
