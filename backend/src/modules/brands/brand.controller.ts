import type { RequestHandler } from 'express';
import type { z } from 'zod';
import { AppError } from '../../middleware/errors.js';
import { getStringParam } from '../../lib/supabase-result.js';
import { brandService } from './brand.service.js';
import type { createBrandSchema, updateBrandSchema } from './brand.validation.js';

type CreateBrandBody = z.infer<typeof createBrandSchema>;
type UpdateBrandBody = z.infer<typeof updateBrandSchema>;

function getAccessToken(req: Parameters<RequestHandler>[0]): string {
  const token = req.header('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) throw new AppError(401, 'Se requiere un token de acceso.');
  return token;
}

export const listBrands: RequestHandler = async (req, res) => {
  res.json(await brandService.list(getAccessToken(req)));
};

export const getBrand: RequestHandler = async (req, res) => {
  res.json(await brandService.get(getAccessToken(req), getStringParam(req.params, 'brandId')));
};

export const createBrand: RequestHandler = async (req, res) => {
  res.status(201).json(await brandService.create(getAccessToken(req), req.body as CreateBrandBody));
};

export const updateBrand: RequestHandler = async (req, res) => {
  res.json(await brandService.update(
    getAccessToken(req),
    getStringParam(req.params, 'brandId'),
    req.body as UpdateBrandBody,
  ));
};

export const deleteBrand: RequestHandler = async (req, res) => {
  await brandService.delete(getAccessToken(req), getStringParam(req.params, 'brandId'));
  res.status(204).end();
};
