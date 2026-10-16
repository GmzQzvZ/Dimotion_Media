import { Routes } from '@angular/router';
import { authGuard, roleGuard } from '../../core/auth/auth.guards';
import { FeaturePageComponent } from '../../shared/components/feature-page.component';

export const clientRoutes: Routes = [
  {
    path: 'cliente',
    component: FeaturePageComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['client'], title: 'Portal del cliente', description: 'Consulta tus campañas y su actividad.', section: 'Cliente' },
  },
  {
    path: 'cliente/campanas',
    component: FeaturePageComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['client'], title: 'Mis campañas', description: 'Campañas asociadas a las marcas de tu cuenta.', section: 'Cliente' },
  },
];
