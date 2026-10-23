import { createSupabaseClient } from '../../config/supabase.js';
import { unwrapResult } from '../../lib/supabase-result.js';
import type { z } from 'zod';
import type { createBrandSchema, updateBrandSchema } from './brand.validation.js';

type CreateBrandInput = z.infer<typeof createBrandSchema>;
type UpdateBrandInput = z.infer<typeof updateBrandSchema>;

export const brandService = {
  async list(accessToken: string) {
    const { data, error } = await createSupabaseClient(accessToken)
      .from('brands')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return unwrapResult(data, error);
    return data;
  },

  async get(accessToken: string, brandId: string) {
    const { data, error } = await createSupabaseClient(accessToken)
      .from('brands')
      .select('*')
      .eq('id', brandId)
      .maybeSingle();
    return unwrapResult(data, error, 'La marca solicitada no existe.');
  },

  async create(accessToken: string, input: CreateBrandInput) {
    const { data, error } = await createSupabaseClient(accessToken)
      .from('brands')
      .insert(input)
      .select('*')
      .single();
    return unwrapResult(data, error);
  },

  async update(accessToken: string, brandId: string, input: UpdateBrandInput) {
    const { data, error } = await createSupabaseClient(accessToken)
      .from('brands')
      .update(input)
      .eq('id', brandId)
      .select('*')
      .maybeSingle();
    return unwrapResult(data, error, 'La marca solicitada no existe.');
  },

  async delete(accessToken: string, brandId: string) {
    const { data, error } = await createSupabaseClient(accessToken)
      .from('brands')
      .delete()
      .eq('id', brandId)
      .select('id')
      .maybeSingle();
    return unwrapResult(data, error, 'La marca solicitada no existe.');
  },
};
