import type { RequestHandler } from 'express';
import type { z } from 'zod';
import { AppError } from '../../middleware/errors.js';
import { getStringParam } from '../../lib/supabase-result.js';
import { modelService } from './model.service.js';
import type { createModelSchema, updateModelSchema } from './model.validation.js';

type CreateModelBody = z.infer<typeof createModelSchema>;
type UpdateModelBody = z.infer<typeof updateModelSchema>;

function getAccessToken(req: Parameters<RequestHandler>[0]): string {
  const token = req.header('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) throw new AppError(401, 'Se requiere un token de acceso.');
  return token;
}

export const listModels: RequestHandler = async (req, res) => {
  res.json(await modelService.list(getAccessToken(req)));
};

export const listManageModels: RequestHandler = async (req, res) => {
  res.json(await modelService.list(getAccessToken(req)));
};

export const getModel: RequestHandler = async (req, res) => {
  res.json(await modelService.get(getAccessToken(req), getStringParam(req.params, 'modelId')));
};

export const createModel: RequestHandler = async (req, res) => {
  res.status(201).json(await modelService.create(getAccessToken(req), req.body as CreateModelBody));
};

export const updateModel: RequestHandler = async (req, res) => {
  res.json(await modelService.update(
    getAccessToken(req),
    getStringParam(req.params, 'modelId'),
    req.body as UpdateModelBody,
  ));
};

export const deleteModel: RequestHandler = async (req, res) => {
  await modelService.delete(getAccessToken(req), getStringParam(req.params, 'modelId'));
  res.status(204).end();
};
