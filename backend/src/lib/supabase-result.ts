import { AppError } from '../middleware/errors.js';

type SupabaseError = { code?: string };

export function unwrapResult<T>(
  data: T | null,
  error: SupabaseError | null,
  missingMessage = 'El recurso solicitado no existe.',
): T {
  if (error) {
    if (error.code === '23505') throw new AppError(409, 'El recurso ya existe.');
    if (error.code === '23503') throw new AppError(409, 'El recurso está relacionado con otros datos.');
    if (error.code === '42501') throw new AppError(403, 'No tienes permisos para realizar esta operación.');
    if (error.code === '23514' || error.code === '22P02') {
      throw new AppError(400, 'Los datos no cumplen las reglas requeridas.');
    }
    throw error;
  }
  if (data === null) throw new AppError(404, missingMessage);
  return data;
}

export function getStringParam(params: Record<string, string | string[] | undefined>, name: string): string {
  const value = params[name];
  if (typeof value !== 'string' || value.length === 0) {
    throw new AppError(400, `El parámetro ${name} es inválido.`);
  }
  return value;
}
