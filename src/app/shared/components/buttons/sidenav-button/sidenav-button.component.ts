import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MaterialModule } from 'src/app/material/material.module';
import { AppearanceService } from 'src/app/services/appearance.service';

@Component({
  selector: 'sidenav-button',
  standalone: true,
  imports: [MaterialModule],
  template: ` <button style="vertical-align: middle;" mat-icon-button (click)="toggleSidenav()">
    <mat-icon>menu</mat-icon>
  </button>`,
  styles: ``,
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SidenavButtonComponent {
  constructor(private appearanceService: AppearanceService) {}

  toggleSidenav() {
    this.appearanceService.toggleSidenav.update((value) => !value);
  }
}
