import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { interval, map } from 'rxjs';
import { InternalProcedure } from '../../models';

@Component({
  selector: 'app-internal-detail',
  templateUrl: './internal-detail.component.html',
  styles: '',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InternalDetailComponent {
  @Input({ required: true }) procedure: InternalProcedure;
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
