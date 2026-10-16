import { Routes } from '@angular/router';
import { authGuard, roleGuard } from '../../core/auth/auth.guards';
import { FeaturePageComponent } from '../../shared/components/feature-page.component';

export const brandRoutes: Routes = [{
  path: 'admin/marcas',
  component: FeaturePageComponent,
  canActivate: [authGuard, roleGuard],
  data: { roles: ['admin'], title: 'Marcas', description: 'Gestión de marcas y asociaciones con clientes.', section: 'Administración' },
}];
