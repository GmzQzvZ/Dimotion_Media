import { createSupabaseClient } from '../../config/supabase.js';
import { unwrapResult } from '../../lib/supabase-result.js';
import type { z } from 'zod';
import type { createCampaignSchema, campaignStatusSchema } from './campaign.validation.js';

type CreateCampaignInput = z.infer<typeof createCampaignSchema>;
type CampaignStatus = z.infer<typeof campaignStatusSchema>;

export const campaignService = {
  async listForUser(accessToken: string) {
    const { data, error } = await createSupabaseClient(accessToken)
      .from('campaigns')
      .select('*')
      .order('created_at', { ascending: false });
    if (error) return unwrapResult(data, error);
    return data;
  },

  async getHistory(accessToken: string, campaignId: string) {
    const { data, error } = await createSupabaseClient(accessToken)
      .from('campaign_status_history')
      .select('*')
      .eq('campaign_id', campaignId)
      .order('created_at', { ascending: false });
    if (error) return unwrapResult(data, error);
    return data;
  },

  async create(accessToken: string, createdBy: string, input: CreateCampaignInput) {
    const { data, error } = await createSupabaseClient(accessToken)
      .from('campaigns')
      .insert({
        brand_id: input.brandId,
        package_id: input.packageId ?? null,
        model_id: input.modelId ?? null,
        title: input.title,
        description: input.description ?? null,
        created_by: createdBy,
      })
      .select('*')
      .single();
    return unwrapResult(data, error);
  },

  async updateStatus(accessToken: string, campaignId: string, status: CampaignStatus) {
    const { data, error } = await createSupabaseClient(accessToken)
      .from('campaigns')
      .update({ status })
      .eq('id', campaignId)
      .select('*')
      .maybeSingle();
    return unwrapResult(data, error, 'La campaña solicitada no existe.');
  },
};
