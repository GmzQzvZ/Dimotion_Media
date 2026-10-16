import { Router } from 'express';
import { createCampaign, listCampaigns, updateCampaignStatus } from './campaign.controller.js';
import { requireRole } from '../../middleware/auth.js';
import { validateBody } from '../../middleware/validate.js';
import { createCampaignSchema, updateCampaignStatusSchema } from './campaign.validation.js';

export const campaignRoutes = Router();

campaignRoutes.get('/', listCampaigns);
campaignRoutes.post('/', requireRole('admin'), validateBody(createCampaignSchema), createCampaign);
campaignRoutes.patch(
  '/:campaignId/status',
  requireRole('admin'),
  validateBody(updateCampaignStatusSchema),
  updateCampaignStatus,
);
