import { Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { validateBody, validateParams } from '../../middleware/validate.js';
import {
  createReservation,
  deleteReservation,
  getReservation,
  listReservations,
  updateReservation,
} from './reservation.controller.js';
import {
  createReservationSchema,
  reservationIdSchema,
  updateReservationSchema,
} from './reservation.validation.js';

export const reservationRoutes = Router();

reservationRoutes.use(requireAuth);
reservationRoutes.get('/', listReservations);
reservationRoutes.get('/:reservationId', validateParams(reservationIdSchema), getReservation);
reservationRoutes.post(
  '/',
  requireRole('client'),
  validateBody(createReservationSchema),
  createReservation,
);
reservationRoutes.patch(
  '/:reservationId',
  requireRole('admin'),
  validateParams(reservationIdSchema),
  validateBody(updateReservationSchema),
  updateReservation,
);
reservationRoutes.delete(
  '/:reservationId',
  requireRole('admin'),
  validateParams(reservationIdSchema),
  deleteReservation,
);
