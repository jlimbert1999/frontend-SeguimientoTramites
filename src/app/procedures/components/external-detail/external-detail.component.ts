import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Subscription, timer } from 'rxjs';
import { LocationProcedure } from 'src/app/communication/models/workflow.interface';
import { ExternalProcedure } from '../../models';

@Component({
  selector: 'app-external-detail',
  templateUrl: './external-detail.component.html',
  styleUrls: ['./external-detail.component.scss'],
})
export class ExternalDetailComponent implements OnInit, OnDestroy {
  @Input() procedure: ExternalProcedure;
  @Input() Location: LocationProcedure[] = [];
  sourceTimer = timer(0, 1000);
  timerSubscription: Subscription;
  duration: string = '';

  constructor() {}
  ngOnInit(): void {
    this.createTimer();
  }

  createTimer() {
    this.timerSubscription = this.sourceTimer.subscribe(
      (val) => (this.duration = this.procedure.getDuration())
    );
  }

  ngOnDestroy(): void {
    this.timerSubscription.unsubscribe();
  }
}
