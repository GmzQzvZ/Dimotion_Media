import { createClient } from '@supabase/supabase-js';
import { env } from './env.js';
import { AppError } from '../middleware/errors.js';

export function createSupabaseClient(accessToken: string) {
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    throw new AppError(503, 'La autenticación de Supabase no está configurada en el servidor.');
  }

  return createClient(env.supabaseUrl, env.supabaseAnonKey, {
    global: { headers: { Authorization: `Bearer ${accessToken}` } },
    auth: { autoRefreshToken: false, persistSession: false },
  });
}

export function createPublicSupabaseClient() {
  if (!env.supabaseUrl || !env.supabaseAnonKey) {
    throw new AppError(503, 'La configuración de Supabase no está disponible en el servidor.');
  }

  return createClient(env.supabaseUrl, env.supabaseAnonKey, {
    auth: { autoRefreshToken: false, persistSession: false },
  });
}
