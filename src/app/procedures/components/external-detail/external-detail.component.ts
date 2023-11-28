import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { interval, map } from 'rxjs';
import { ExternalProcedure } from '../../models';

@Component({
  selector: 'app-external-detail',
  templateUrl: './external-detail.component.html',
  styles: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ExternalDetailComponent {
  @Input({ required: true }) procedure: ExternalProcedure;
  $timer = interval(1000);
  duration = toSignal(
    this.$timer.pipe(
      map(() => {
        return this.procedure.getDuration();
      })
    ),
    { initialValue: 'Calculando.....' }
  );
}
