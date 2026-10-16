import { Component, Input } from '@angular/core';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-feature-page',
  standalone: true,
  imports: [RouterLink],
  template: `
    <section class="feature">
      <p class="eyebrow">{{ section }}</p>
      <h1>{{ title }}</h1>
      <p class="description">{{ description }}</p>
      @if (section === 'Inicio') {
        <div class="actions">
          <a class="button primary" routerLink="/portafolio">Explorar proyectos</a>
          <a class="button secondary" routerLink="/contacto">Hablemos</a>
        </div>
      } @else if (section === 'Campañas') {
        <ol class="stages">
          <li>Pago recibido</li><li>Producción</li><li>Edición</li><li>Entrega</li><li>Finalizada</li>
        </ol>
      }
      <p class="note">Estructura inicial del MVP. Esta pantalla se completará en una etapa posterior.</p>
    </section>
  `,
  styles: `
    .feature { margin: clamp(3rem, 10vw, 8rem) auto; max-width: 850px; padding: 0 1.5rem; }
    .eyebrow { color: #a84b39; font-size: .78rem; font-weight: 700; letter-spacing: .16em; text-transform: uppercase; }
    h1 { font-size: clamp(2.5rem, 8vw, 5.5rem); letter-spacing: -.055em; line-height: 1; margin: 1rem 0; }
    .description { color: #60616a; font-size: clamp(1.1rem, 2vw, 1.4rem); max-width: 650px; }
    .actions { display: flex; flex-wrap: wrap; gap: .75rem; margin-top: 2rem; }
    .button { border-radius: 999px; padding: .85rem 1.2rem; text-decoration: none; }
    .primary { background: #a84b39; color: white; }
    .secondary { border: 1px solid #b7b8bd; color: #1d1e23; }
    .stages { display: flex; flex-wrap: wrap; gap: 1.5rem; padding: 1.5rem 1.5rem 1.5rem 2rem; }
    .note { color: #83848b; font-size: .9rem; margin-top: 3rem; }
  `,
})
export class FeaturePageComponent {
  @Input() title = '';
  @Input() description = '';
  @Input() section = '';
}
