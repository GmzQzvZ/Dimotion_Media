import { Component, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';
import { UiButtonComponent } from '../../shared/components/ui-button.component';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule, RouterLink, UiButtonComponent],
  template: `
    <section class="auth-card">
      <p class="eyebrow">Portal Dimotion</p>
      <h1>Iniciar sesión</h1>
      @if (!auth.isConfigured()) {
        <p class="notice">La autenticación requiere configurar la URL y la clave pública de Supabase.</p>
      }
      <form (ngSubmit)="submit()">
        <label>Correo electrónico<input name="email" type="email" [(ngModel)]="email" required autocomplete="email"></label>
        <label>Contraseña<input name="password" type="password" [(ngModel)]="password" required autocomplete="current-password"></label>
        @if (error()) { <p class="error" role="alert">{{ error() }}</p> }
        <app-ui-button type="submit">Ingresar</app-ui-button>
      </form>
      <a routerLink="/">Volver al sitio público</a>
    </section>
  `,
  styles: `
    .auth-card { margin: 5rem auto; max-width: 430px; padding: 2rem; }
    .eyebrow { color: #a84b39; font-size: .8rem; font-weight: 700; text-transform: uppercase; }
    h1 { font-size: 2.5rem; letter-spacing: -.04em; }
    form, label { display: grid; gap: .75rem; }
    form { gap: 1.25rem; margin: 2rem 0; }
    label { color: #50515a; font-size: .9rem; }
    input { border: 1px solid #c9c9ce; border-radius: .5rem; font: inherit; padding: .8rem; }
    .notice { background: #f6eee9; border-radius: .5rem; padding: .8rem; }
    .error { color: #a12828; }
    a { color: #53545a; }
  `,
})
export class LoginComponent {
  readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  readonly error = signal('');
  email = '';
  password = '';

  async submit(): Promise<void> {
    this.error.set('');
    try {
      await this.auth.signIn(this.email, this.password);
      const returnUrl = this.route.snapshot.queryParamMap.get('returnUrl') ?? '/cliente';
      await this.router.navigateByUrl(returnUrl);
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'No fue posible iniciar sesión.');
    }
  }
}
