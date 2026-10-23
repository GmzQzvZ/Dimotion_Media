import { createSupabaseClient } from '../../config/supabase.js';
import { unwrapResult } from '../../lib/supabase-result.js';
import type { z } from 'zod';
import type { createReservationSchema, updateReservationSchema } from './reservation.validation.js';

type CreateReservationInput = z.infer<typeof createReservationSchema>;
type UpdateReservationInput = z.infer<typeof updateReservationSchema>;

export const reservationService = {
  async list(accessToken: string) {
    const { data, error } = await createSupabaseClient(accessToken)
      .from('reservations')
      .select('*')
      .order('scheduled_at', { ascending: true });
    if (error) return unwrapResult(data, error);
    return data;
  },

  async get(accessToken: string, reservationId: string) {
    const { data, error } = await createSupabaseClient(accessToken)
      .from('reservations')
      .select('*')
      .eq('id', reservationId)
      .maybeSingle();
    return unwrapResult(data, error, 'La reserva solicitada no existe.');
  },

  async create(accessToken: string, createdBy: string, input: CreateReservationInput) {
    const { brandId, campaignId, scheduledAt, notes } = input;
    const { data, error } = await createSupabaseClient(accessToken)
      .from('reservations')
      .insert({
        brand_id: brandId,
        campaign_id: campaignId,
        scheduled_at: scheduledAt,
        notes,
        created_by: createdBy,
      })
      .select('*')
      .single();
    return unwrapResult(data, error);
  },

  async update(accessToken: string, reservationId: string, input: UpdateReservationInput) {
    const { scheduledAt, ...updates } = input;
    const { data, error } = await createSupabaseClient(accessToken)
      .from('reservations')
      .update({ ...updates, ...(scheduledAt ? { scheduled_at: scheduledAt } : {}) })
      .eq('id', reservationId)
      .select('*')
      .maybeSingle();
    return unwrapResult(data, error, 'La reserva solicitada no existe.');
  },

  async delete(accessToken: string, reservationId: string) {
    const { data, error } = await createSupabaseClient(accessToken)
      .from('reservations')
      .delete()
      .eq('id', reservationId)
      .select('id')
      .maybeSingle();
    return unwrapResult(data, error, 'La reserva solicitada no existe.');
  },
};
