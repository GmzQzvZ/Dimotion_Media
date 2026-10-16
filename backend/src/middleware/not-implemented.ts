import type { RequestHandler } from 'express';
import { AppError } from './errors.js';

export const notImplemented: RequestHandler = (_req, _res, next) => {
  next(new AppError(501, 'Este módulo está preparado, pero aún no está implementado.'));
};
