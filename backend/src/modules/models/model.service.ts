import { createSupabaseClient } from '../../config/supabase.js';
import { unwrapResult } from '../../lib/supabase-result.js';
import type { z } from 'zod';
import type { createModelSchema, updateModelSchema } from './model.validation.js';

type CreateModelInput = z.infer<typeof createModelSchema>;
type UpdateModelInput = z.infer<typeof updateModelSchema>;

export const modelService = {
  async list(accessToken: string) {
    const { data, error } = await createSupabaseClient(accessToken)
      .from('models')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return unwrapResult(data, error);
    return data;
  },

  async get(accessToken: string, modelId: string) {
    const { data, error } = await createSupabaseClient(accessToken)
      .from('models')
      .select('*')
      .eq('id', modelId)
      .maybeSingle();
    return unwrapResult(data, error, 'El modelo solicitado no existe.');
  },

  async create(accessToken: string, input: CreateModelInput) {
    const { data, error } = await createSupabaseClient(accessToken)
      .from('models')
      .insert(input)
      .select('*')
      .single();
    return unwrapResult(data, error);
  },

  async update(accessToken: string, modelId: string, input: UpdateModelInput) {
    const { data, error } = await createSupabaseClient(accessToken)
      .from('models')
      .update(input)
      .eq('id', modelId)
      .select('*')
      .maybeSingle();
    return unwrapResult(data, error, 'El modelo solicitado no existe.');
  },

  async delete(accessToken: string, modelId: string) {
    const { data, error } = await createSupabaseClient(accessToken)
      .from('models')
      .delete()
      .eq('id', modelId)
      .select('id')
      .maybeSingle();
    return unwrapResult(data, error, 'El modelo solicitado no existe.');
  },
};
