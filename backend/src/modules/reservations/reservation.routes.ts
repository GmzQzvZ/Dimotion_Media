import { Router } from 'express';
import { requireRole } from '../../middleware/auth.js';
import { notImplemented } from '../../middleware/not-implemented.js';

export const reservationRoutes = Router();
reservationRoutes.use(requireRole('admin'), notImplemented);
