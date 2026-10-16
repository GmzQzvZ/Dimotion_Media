import { Routes } from '@angular/router';
import { authGuard, roleGuard } from '../../core/auth/auth.guards';
import { FeaturePageComponent } from '../../shared/components/feature-page.component';

export const modelRoutes: Routes = [{
  path: 'admin/modelos',
  component: FeaturePageComponent,
  canActivate: [authGuard, roleGuard],
  data: { roles: ['admin'], title: 'Modelos y talento', description: 'Gestión de modelos y talento.', section: 'Administración' },
}];
