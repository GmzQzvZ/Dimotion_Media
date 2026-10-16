import { z } from 'zod';

export const campaignStatusSchema = z.enum([
  'payment_received',
  'production',
  'editing',
  'delivery',
  'completed',
]);

export const createCampaignSchema = z.object({
  brandId: z.string().uuid(),
  packageId: z.string().uuid().nullable().optional(),
  modelId: z.string().uuid().nullable().optional(),
  title: z.string().trim().min(1).max(160),
  description: z.string().trim().max(2000).nullable().optional(),
});

export const updateCampaignStatusSchema = z.object({
  status: campaignStatusSchema,
});
