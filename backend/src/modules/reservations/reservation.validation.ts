import { z } from 'zod';

export const reservationIdSchema = z.object({ reservationId: z.string().uuid() });

export const createReservationSchema = z.object({
  brandId: z.string().uuid(),
  campaignId: z.string().uuid().nullable().optional(),
  scheduledAt: z.iso.datetime(),
  notes: z.string().trim().max(2000).nullable().optional(),
}).strict();

export const updateReservationSchema = z.object({
  scheduledAt: z.iso.datetime().optional(),
  notes: z.string().trim().max(2000).nullable().optional(),
  status: z.enum(['pending', 'confirmed', 'cancelled', 'completed']).optional(),
}).strict().refine((value) => Object.keys(value).length > 0, 'Incluye al menos un campo para actualizar.');
