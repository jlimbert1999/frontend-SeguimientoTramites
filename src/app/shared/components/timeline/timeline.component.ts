import { Component, Input } from '@angular/core';
import { eventProcedure } from 'src/app/procedures/interfaces';

@Component({
  selector: 'app-timeline',
  templateUrl: './timeline.component.html',
  styleUrls: ['./timeline.component.scss'],
})
export class TimelineComponent {
  @Input() timeline: eventProcedure[] = [];
}
