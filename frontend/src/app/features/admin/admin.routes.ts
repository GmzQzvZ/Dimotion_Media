import { Routes } from '@angular/router';
import { authGuard, roleGuard } from '../../core/auth/auth.guards';
import { FeaturePageComponent } from '../../shared/components/feature-page.component';

export const adminRoutes: Routes = [
  {
    path: 'admin',
    component: FeaturePageComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'], title: 'Panel administrativo', description: 'Espacio de gestión de Dimotion.', section: 'Administración' },
  },
  {
    path: 'admin/campanas',
    component: FeaturePageComponent,
    canActivate: [authGuard, roleGuard],
    data: { roles: ['admin'], title: 'Gestión de campañas', description: 'Administra campañas y actualiza su estado.', section: 'Administración' },
  },
];
