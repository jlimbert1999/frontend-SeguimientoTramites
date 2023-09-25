import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { InternalProcedure } from '../../models';

@Component({
  selector: 'app-internal-detail',
  templateUrl: './internal-detail.component.html',
  styleUrls: ['./internal-detail.component.scss'],
})
export class InternalDetailComponent implements OnInit, OnDestroy {
  @Input() procedure: InternalProcedure;
  // @Input() Location: LocationProcedure[] = [];
  timer: NodeJS.Timer;
  duration: string = '';

  constructor(private _location: Location) {}
  ngOnInit(): void {
    this.duration = this.procedure.getDuration();
    // this.createTimer();
  }

  ngOnDestroy(): void {
    // clearInterval(this.timer);
  }

  createTimer() {
    this.timer = setInterval(() => {
      this.duration = this.procedure.getDuration();
    }, 1000);
  }
}
