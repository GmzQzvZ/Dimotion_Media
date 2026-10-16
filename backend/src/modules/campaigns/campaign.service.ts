import { AppError } from '../../middleware/errors.js';

export const campaignService = {
  async listForUser(): Promise<never> {
    throw new AppError(501, 'La consulta de campañas se implementará en una etapa posterior.');
  },

  async create(): Promise<never> {
    throw new AppError(501, 'La creación de campañas se implementará en una etapa posterior.');
  },

  async updateStatus(): Promise<never> {
    throw new AppError(501, 'La actualización del estado se implementará en una etapa posterior.');
  },
};
