import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { SidenavButtonComponent } from 'src/app/shared/components/buttons/sidenav-button/sidenav-button.component';

@Component({
  selector: 'report-title',
  standalone: true,
  imports: [CommonModule, SidenavButtonComponent],
  template: `<div class="display-6 p-2"><sidenav-button></sidenav-button> {{ title }}</div>`,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TitleComponent {
  @Input() title: string = '';
}
