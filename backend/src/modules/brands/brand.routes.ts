import { Router } from 'express';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { validateBody, validateParams } from '../../middleware/validate.js';
import {
  createBrand,
  deleteBrand,
  getBrand,
  listBrands,
  updateBrand,
} from './brand.controller.js';
import { brandIdSchema, createBrandSchema, updateBrandSchema } from './brand.validation.js';

export const brandRoutes = Router();

brandRoutes.use(requireAuth);
brandRoutes.get('/', listBrands);
brandRoutes.get('/:brandId', validateParams(brandIdSchema), getBrand);
brandRoutes.post('/', requireRole('admin'), validateBody(createBrandSchema), createBrand);
brandRoutes.patch(
  '/:brandId',
  requireRole('admin'),
  validateParams(brandIdSchema),
  validateBody(updateBrandSchema),
  updateBrand,
);
brandRoutes.delete('/:brandId', requireRole('admin'), validateParams(brandIdSchema), deleteBrand);
