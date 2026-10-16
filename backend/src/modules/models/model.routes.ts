import { Router } from 'express';
import { requireRole } from '../../middleware/auth.js';
import { notImplemented } from '../../middleware/not-implemented.js';

export const modelRoutes = Router();
modelRoutes.use(requireRole('admin'), notImplemented);
