import { Routes } from '@angular/router';
import { authGuard } from '../../core/auth/auth.guards';
import { LoginComponent } from './login.component';
import { LogoutComponent } from './logout.component';

export const authRoutes: Routes = [
  { path: 'login', component: LoginComponent },
  { path: 'logout', component: LogoutComponent, canActivate: [authGuard] },
];
