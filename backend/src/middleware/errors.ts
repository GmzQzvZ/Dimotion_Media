import type { ErrorRequestHandler, RequestHandler } from 'express';
import { ZodError } from 'zod';

export class AppError extends Error {
  constructor(
    public readonly statusCode: number,
    message: string,
  ) {
    super(message);
    this.name = 'AppError';
  }
}

export const notFoundHandler: RequestHandler = (_req, _res, next) => {
  next(new AppError(404, 'La ruta solicitada no existe.'));
};

export const errorHandler: ErrorRequestHandler = (error, _req, res, next) => {
  if (res.headersSent) {
    next(error);
    return;
  }

  if (error instanceof ZodError) {
    res.status(400).json({ error: 'Solicitud inválida.', details: error.issues });
    return;
  }

  if (error instanceof AppError) {
    res.status(error.statusCode).json({ error: error.message });
    return;
  }

  console.error('Error no controlado en la API.', error);
  res.status(500).json({ error: 'Error interno del servidor.' });
};
