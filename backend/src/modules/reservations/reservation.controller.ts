import type { RequestHandler } from 'express';
import type { z } from 'zod';
import { AppError } from '../../middleware/errors.js';
import { getStringParam } from '../../lib/supabase-result.js';
import { reservationService } from './reservation.service.js';
import type { createReservationSchema, updateReservationSchema } from './reservation.validation.js';

type CreateReservationBody = z.infer<typeof createReservationSchema>;
type UpdateReservationBody = z.infer<typeof updateReservationSchema>;

function getAccessToken(req: Parameters<RequestHandler>[0]): string {
  const token = req.header('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) throw new AppError(401, 'Se requiere un token de acceso.');
  return token;
}

export const listReservations: RequestHandler = async (req, res) => {
  res.json(await reservationService.list(getAccessToken(req)));
};

export const getReservation: RequestHandler = async (req, res) => {
  res.json(await reservationService.get(
    getAccessToken(req),
    getStringParam(req.params, 'reservationId'),
  ));
};

export const createReservation: RequestHandler = async (req, res) => {
  if (!req.authContext) throw new AppError(401, 'Se requiere un token de acceso.');
  res.status(201).json(await reservationService.create(
    getAccessToken(req),
    req.authContext.userId,
    req.body as CreateReservationBody,
  ));
};

export const updateReservation: RequestHandler = async (req, res) => {
  res.json(await reservationService.update(
    getAccessToken(req),
    getStringParam(req.params, 'reservationId'),
    req.body as UpdateReservationBody,
  ));
};

export const deleteReservation: RequestHandler = async (req, res) => {
  await reservationService.delete(getAccessToken(req), getStringParam(req.params, 'reservationId'));
  res.status(204).end();
};
