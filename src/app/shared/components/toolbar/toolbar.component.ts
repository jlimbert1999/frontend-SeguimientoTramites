import { ChangeDetectionStrategy, Component, Input } from '@angular/core';

@Component({
  selector: 'toolbar',
  templateUrl: './toolbar.component.html',
  styles: `
      p {
        position: sticky;
        top: 0;
        z-index: 1;
      }
  `,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ToolbarComponent {
  @Input() title: string = 'Sin titulo';
}
