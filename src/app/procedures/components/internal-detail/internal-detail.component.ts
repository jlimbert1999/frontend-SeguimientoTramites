import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { InternalProcedure } from '../../models';

@Component({
  selector: 'app-internal-detail',
  templateUrl: './internal-detail.component.html',
  styleUrls: ['./internal-detail.component.scss'],
})
export class InternalDetailComponent implements OnInit, OnDestroy {
  @Input() procedure: InternalProcedure;
  sourceTimer = timer(0, 1000);
  timerSubscription: Subscription;
  duration: string = '';

  constructor() {}
  ngOnInit(): void {
    this.createTimer();
  }

  ngOnDestroy(): void {
    this.timerSubscription.unsubscribe();
  }

  createTimer() {
    this.timerSubscription = this.sourceTimer.subscribe(
      (val) => (this.duration = this.procedure.getDuration())
    );
  }
}
