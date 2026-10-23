import { Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { validateBody, validateParams } from '../../middleware/validate.js';
import {
  createModel,
  deleteModel,
  getModel,
  listManageModels,
  listModels,
  updateModel,
} from './model.controller.js';
import { createModelSchema, modelIdSchema, updateModelSchema } from './model.validation.js';

export const modelRoutes = Router();

modelRoutes.get('/', requireAuth, requireRole('admin'), listModels);
modelRoutes.get('/manage', requireAuth, requireRole('admin'), listManageModels);
modelRoutes.get('/:modelId', requireAuth, requireRole('admin'), validateParams(modelIdSchema), getModel);
modelRoutes.post('/', requireAuth, requireRole('admin'), validateBody(createModelSchema), createModel);
modelRoutes.patch(
  '/:modelId',
  requireAuth,
  requireRole('admin'),
  validateParams(modelIdSchema),
  validateBody(updateModelSchema),
  updateModel,
);
modelRoutes.delete(
  '/:modelId',
  requireAuth,
  requireRole('admin'),
  validateParams(modelIdSchema),
  deleteModel,
);
