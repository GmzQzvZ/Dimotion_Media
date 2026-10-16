import { Routes } from '@angular/router';
import { authGuard, roleGuard } from '../../core/auth/auth.guards';
import { FeaturePageComponent } from '../../shared/components/feature-page.component';

export const packageRoutes: Routes = [{
  path: 'admin/paquetes',
  component: FeaturePageComponent,
  canActivate: [authGuard, roleGuard],
  data: { roles: ['admin'], title: 'Paquetes', description: 'Gestión de paquetes publicitarios.', section: 'Administración' },
}];
