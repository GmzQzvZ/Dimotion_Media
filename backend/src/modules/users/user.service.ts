import { createSupabaseClient } from '../../config/supabase.js';
import { unwrapResult } from '../../lib/supabase-result.js';
import type { z } from 'zod';
import type { updateUserSchema } from './user.validation.js';

type UpdateUserInput = z.infer<typeof updateUserSchema>;

export const userService = {
  async list(accessToken: string) {
    const { data, error } = await createSupabaseClient(accessToken)
      .from('profiles')
      .select('id, email, full_name, role, created_at, updated_at')
      .order('created_at', { ascending: false });
    if (error) return unwrapResult(data, error);
    return data;
  },

  async get(accessToken: string, userId: string) {
    const { data, error } = await createSupabaseClient(accessToken)
      .from('profiles')
      .select('id, email, full_name, role, created_at, updated_at')
      .eq('id', userId)
      .maybeSingle();
    return unwrapResult(data, error, 'El usuario solicitado no existe.');
  },

  async update(accessToken: string, userId: string, input: UpdateUserInput) {
    const { data, error } = await createSupabaseClient(accessToken)
      .from('profiles')
      .update(input)
      .eq('id', userId)
      .select('id, email, full_name, role, created_at, updated_at')
      .maybeSingle();
    return unwrapResult(data, error, 'El usuario solicitado no existe.');
  },
};
