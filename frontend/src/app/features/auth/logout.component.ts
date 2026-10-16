import { Component, OnInit, inject, signal } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../../core/auth/auth.service';

@Component({
  selector: 'app-logout',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="auth-card">
      <h1>Cerrar sesión</h1>
      @if (error()) {
        <p role="alert">{{ error() }}</p><a routerLink="/cliente">Volver al portal</a>
      } @else {
        <p>Cerrando la sesión…</p>
      }
    </section>
  `,
  styles: `.auth-card { margin: 5rem auto; max-width: 500px; padding: 2rem; }`,
})
export class LogoutComponent implements OnInit {
  private readonly auth = inject(AuthService);
  private readonly router = inject(Router);
  readonly error = signal('');

  ngOnInit(): void {
    void this.signOut();
  }

  private async signOut(): Promise<void> {
    try {
      await this.auth.signOut();
      await this.router.navigate(['/']);
    } catch (error) {
      this.error.set(error instanceof Error ? error.message : 'No fue posible cerrar sesión.');
    }
  }
}
