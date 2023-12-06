import { CommonModule } from '@angular/common';
import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MaterialModule } from 'src/app/material/material.module';

@Component({
  selector: 'progress-spinner',
  standalone: true,
  imports: [CommonModule, MaterialModule],
  template: `
  <div class="overlay">
    <mat-spinner mode="indeterminate" [strokeWidth]="20" [diameter]="200" class="load-spiner"></mat-spinner>
  </div>`,
  styleUrl: './progress-spinner.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ProgressSpinnerComponent {}
