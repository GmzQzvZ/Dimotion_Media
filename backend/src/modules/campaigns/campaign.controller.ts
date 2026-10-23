import type { RequestHandler } from 'express';
import type { z } from 'zod';
import { AppError } from '../../middleware/errors.js';
import { getStringParam } from '../../lib/supabase-result.js';
import { campaignService } from './campaign.service.js';
import type { createCampaignSchema, updateCampaignStatusSchema } from './campaign.validation.js';

type CreateCampaignBody = z.infer<typeof createCampaignSchema>;
type UpdateCampaignStatusBody = z.infer<typeof updateCampaignStatusSchema>;

export const listCampaigns: RequestHandler = async (req, res) => {
  const accessToken = req.header('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!accessToken) throw new AppError(401, 'Se requiere un token de acceso.');
  res.json(await campaignService.listForUser(accessToken));
};

export const getCampaignHistory: RequestHandler = async (req, res) => {
  const accessToken = req.header('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!accessToken) throw new AppError(401, 'Se requiere un token de acceso.');
  res.json(await campaignService.getHistory(
    accessToken,
    getStringParam(req.params, 'campaignId'),
  ));
};

export const createCampaign: RequestHandler = async (req, res) => {
  const accessToken = req.header('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!accessToken || !req.authContext) throw new AppError(401, 'Se requiere un token de acceso.');
  res.status(201).json(await campaignService.create(
    accessToken,
    req.authContext.userId,
    req.body as CreateCampaignBody,
  ));
};

export const updateCampaignStatus: RequestHandler = async (req, res) => {
  const accessToken = req.header('authorization')?.match(/^Bearer\s+(.+)$/i)?.[1];
  if (!accessToken) throw new AppError(401, 'Se requiere un token de acceso.');
  const { status } = req.body as UpdateCampaignStatusBody;
  res.json(await campaignService.updateStatus(
    accessToken,
    getStringParam(req.params, 'campaignId'),
    status,
  ));
};
