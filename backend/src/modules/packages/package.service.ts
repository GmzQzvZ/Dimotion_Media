import { createPublicSupabaseClient, createSupabaseClient } from '../../config/supabase.js';
import { unwrapResult } from '../../lib/supabase-result.js';
import type { z } from 'zod';
import type { createPackageSchema, updatePackageSchema } from './package.validation.js';

type CreatePackageInput = z.infer<typeof createPackageSchema>;
type UpdatePackageInput = z.infer<typeof updatePackageSchema>;

export const packageService = {
  async listPublic() {
    const { data, error } = await createPublicSupabaseClient()
      .from('packages')
      .select('*')
      .eq('active', true)
      .order('price', { ascending: true });
    if (error) return unwrapResult(data, error);
    return data;
  },

  async listManage(accessToken: string) {
    const { data, error } = await createSupabaseClient(accessToken)
      .from('packages')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return unwrapResult(data, error);
    return data;
  },

  async getPublic(packageId: string) {
    const { data, error } = await createPublicSupabaseClient()
      .from('packages')
      .select('*')
      .eq('id', packageId)
      .eq('active', true)
      .maybeSingle();
    return unwrapResult(data, error, 'El paquete solicitado no existe.');
  },

  async create(accessToken: string, input: CreatePackageInput) {
    const { data, error } = await createSupabaseClient(accessToken)
      .from('packages')
      .insert(input)
      .select('*')
      .single();
    return unwrapResult(data, error);
  },

  async update(accessToken: string, packageId: string, input: UpdatePackageInput) {
    const { data, error } = await createSupabaseClient(accessToken)
      .from('packages')
      .update(input)
      .eq('id', packageId)
      .select('*')
      .maybeSingle();
    return unwrapResult(data, error, 'El paquete solicitado no existe.');
  },

  async delete(accessToken: string, packageId: string) {
    const { data, error } = await createSupabaseClient(accessToken)
      .from('packages')
      .delete()
      .eq('id', packageId)
      .select('id')
      .maybeSingle();
    return unwrapResult(data, error, 'El paquete solicitado no existe.');
  },
};
