import { Router } from 'express';
import { brandRoutes } from '../modules/brands/brand.routes.js';
import { campaignRoutes } from '../modules/campaigns/campaign.routes.js';
import { modelRoutes } from '../modules/models/model.routes.js';
import { packageRoutes } from '../modules/packages/package.routes.js';
import { reservationRoutes } from '../modules/reservations/reservation.routes.js';
import { userRoutes } from '../modules/users/user.routes.js';

export const apiRoutes = Router();

apiRoutes.get('/health', (_req, res) => {
  res.status(200).json({ status: 'ok', service: 'dimotion-api' });
});

apiRoutes.use('/campaigns', campaignRoutes);
apiRoutes.use('/brands', brandRoutes);
apiRoutes.use('/packages', packageRoutes);
apiRoutes.use('/models', modelRoutes);
apiRoutes.use('/users', userRoutes);
apiRoutes.use('/reservations', reservationRoutes);
