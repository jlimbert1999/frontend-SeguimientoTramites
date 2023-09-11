import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
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
  timer: NodeJS.Timer;
  duration: string = '';

  constructor(private _location: Location) {}
  ngOnInit(): void {
    this.duration = this.procedure.getDuration();
    this.createTimer();
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  createTimer() {
    this.timer = setInterval(() => {
      this.duration = this.procedure.getDuration();
    }, 1000);
  }
}
