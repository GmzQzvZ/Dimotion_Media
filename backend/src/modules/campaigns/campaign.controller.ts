import type { RequestHandler } from 'express';
import { campaignService } from './campaign.service.js';

export const listCampaigns: RequestHandler = async (_req, res) => {
  res.json(await campaignService.listForUser());
};

export const createCampaign: RequestHandler = async (_req, res) => {
  res.status(201).json(await campaignService.create());
};

export const updateCampaignStatus: RequestHandler = async (_req, res) => {
  res.json(await campaignService.updateStatus());
};
