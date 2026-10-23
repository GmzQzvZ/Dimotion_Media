import { Router } from 'express';
import { createCampaign, getCampaignHistory, listCampaigns, updateCampaignStatus } from './campaign.controller.js';
import { requireAuth, requireRole } from '../../middleware/auth.js';
import { validateBody, validateParams } from '../../middleware/validate.js';
import { campaignIdSchema, createCampaignSchema, updateCampaignStatusSchema } from './campaign.validation.js';

export const campaignRoutes = Router();

campaignRoutes.use(requireAuth);
campaignRoutes.get('/', listCampaigns);
campaignRoutes.get('/:campaignId/history', validateParams(campaignIdSchema), getCampaignHistory);
campaignRoutes.post('/', requireRole('admin'), validateBody(createCampaignSchema), createCampaign);
campaignRoutes.patch(
  '/:campaignId/status',
  requireRole('admin'),
  validateParams(campaignIdSchema),
  validateBody(updateCampaignStatusSchema),
  updateCampaignStatus,
);
