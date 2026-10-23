import { Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { validateBody, validateParams } from '../../middleware/validate.js';
import {
  createPackage,
  deletePackage,
  getPackage,
  listManagePackages,
  listPackages,
  updatePackage,
} from './package.controller.js';
import { packageIdSchema, createPackageSchema, updatePackageSchema } from './package.validation.js';

export const packageRoutes = Router();

packageRoutes.get('/', listPackages);
packageRoutes.get('/manage', requireAuth, requireRole('admin'), listManagePackages);
packageRoutes.get('/:packageId', validateParams(packageIdSchema), getPackage);
packageRoutes.post('/', requireAuth, requireRole('admin'), validateBody(createPackageSchema), createPackage);
packageRoutes.patch(
  '/:packageId',
  requireAuth,
  requireRole('admin'),
  validateParams(packageIdSchema),
  validateBody(updatePackageSchema),
  updatePackage,
);
packageRoutes.delete(
  '/:packageId',
  requireAuth,
  requireRole('admin'),
  validateParams(packageIdSchema),
  deletePackage,
);
