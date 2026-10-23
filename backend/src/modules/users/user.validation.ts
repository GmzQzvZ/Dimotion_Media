import { z } from 'zod';
import { userRoleSchema } from './user.types.js';

export const userIdSchema = z.object({ userId: z.string().uuid() });

export const updateUserSchema = z.object({
  full_name: z.string().trim().min(1).max(160).optional(),
  role: userRoleSchema.optional(),
}).strict().refine((value) => Object.keys(value).length > 0, 'Incluye al menos un campo para actualizar.');
