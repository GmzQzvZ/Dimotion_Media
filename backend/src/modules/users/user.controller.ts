import type { RequestHandler } from 'express';
import { AppError } from '../../middleware/errors.js';
import { getStringParam } from '../../lib/supabase-result.js';
import { userService } from './user.service.js';
import type { Request } from 'express';
import type { z } from 'zod';
import type { updateUserSchema } from './user.validation.js';

type UpdateUserBody = z.infer<typeof updateUserSchema>;

function getAccessToken(req: Request): string {
  const token = req.header('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!token) throw new AppError(401, 'Se requiere un token de acceso.');
  return token;
}

export const listUsers: RequestHandler = async (req, res) => {
  res.json(await userService.list(getAccessToken(req)));
};

export const getUser: RequestHandler = async (req, res) => {
  res.json(await userService.get(getAccessToken(req), getStringParam(req.params, 'userId')));
};

export const updateUser: RequestHandler = async (req, res) => {
  res.json(await userService.update(
    getAccessToken(req),
    getStringParam(req.params, 'userId'),
    req.body as UpdateUserBody,
  ));
};
