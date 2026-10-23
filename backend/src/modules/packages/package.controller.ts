import type { RequestHandler } from 'express';
import type { z } from 'zod';
import { AppError } from '../../middleware/errors.js';
import { getStringParam } from '../../lib/supabase-result.js';
import { packageService } from './package.service.js';
import type { createPackageSchema, updatePackageSchema } from './package.validation.js';

type CreatePackageBody = z.infer<typeof createPackageSchema>;
type UpdatePackageBody = z.infer<typeof updatePackageSchema>;

function getAccessToken(req: Parameters<RequestHandler>[0]): string {
  const token = req.header('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) throw new AppError(401, 'Se requiere un token de acceso.');
  return token;
}

export const listPackages: RequestHandler = async (_req, res) => {
  res.json(await packageService.listPublic());
};

export const listManagePackages: RequestHandler = async (req, res) => {
  res.json(await packageService.listManage(getAccessToken(req)));
};

export const getPackage: RequestHandler = async (req, res) => {
  res.json(await packageService.getPublic(getStringParam(req.params, 'packageId')));
};

export const createPackage: RequestHandler = async (req, res) => {
  res.status(201).json(await packageService.create(getAccessToken(req), req.body as CreatePackageBody));
};

export const updatePackage: RequestHandler = async (req, res) => {
  res.json(await packageService.update(
    getAccessToken(req),
    getStringParam(req.params, 'packageId'),
    req.body as UpdatePackageBody,
  ));
};

export const deletePackage: RequestHandler = async (req, res) => {
  await packageService.delete(getAccessToken(req), getStringParam(req.params, 'packageId'));
  res.status(204).end();
};
