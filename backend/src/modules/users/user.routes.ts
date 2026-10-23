import { Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { validateBody, validateParams } from '../../middleware/validate.js';
import { getUser, listUsers, updateUser } from './user.controller.js';
import { updateUserSchema, userIdSchema } from './user.validation.js';

export const userRoutes = Router();

userRoutes.use(requireAuth, requireRole('admin'));
userRoutes.get('/', listUsers);
userRoutes.get('/:userId', validateParams(userIdSchema), getUser);
userRoutes.patch('/:userId', validateParams(userIdSchema), validateBody(updateUserSchema), updateUser);
