import { Component } from '@angular/core';

@Component({
  selector: 'app-ui-card',
  standalone: true,
  template: `<article><ng-content /></article>`,
  styles: `
    article { background: #fff; border: 1px solid #e4e4e8; border-radius: 1rem; padding: 1.25rem; }
  `,
})
export class UiCardComponent {}
