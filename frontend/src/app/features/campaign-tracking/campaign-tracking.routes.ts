import { Routes } from '@angular/router';
import { authGuard, roleGuard } from '../../core/auth/auth.guards';
import { FeaturePageComponent } from '../../shared/components/feature-page.component';

export const campaignTrackingRoutes: Routes = [
  {
    path: 'seguimiento',
    component: FeaturePageComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['client', 'admin'], title: 'Seguimiento de campaña', description: 'Pago recibido → Producción → Edición → Entrega → Finalizada.', section: 'Campañas' },
  },
];
