import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-ui-button',
  standalone: true,
  template: `<button [type]="type"><ng-content /></button>`,
  styles: `
    button { background: #a84b39; border: 0; border-radius: 999px; color: #fff; cursor: pointer; font: inherit; padding: .75rem 1.1rem; }
    button:disabled { cursor: not-allowed; opacity: .65; }
  `,
})
export class UiButtonComponent {
  @Input() type: 'button' | 'submit' = 'button';
}
