import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { ExternalDetail } from 'src/app/procedures/models/externo.model';
import { LocationProcedure } from 'src/app/communication/models/workflow.interface';


@Component({
  selector: 'app-info-tramite-externo',
  templateUrl: './info-tramite-externo.component.html',
  styleUrls: ['./info-tramite-externo.component.scss']
})
export class InfoTramiteExternoComponent implements OnInit, OnDestroy {
  @Input() Tramite: ExternalDetail
  @Input() Location: LocationProcedure[] = []
  timer: NodeJS.Timer;
  dateCount: string = ''

  constructor(private _location: Location,) {

  }
  ngOnInit(): void {
    this.createTimer()
  }



  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  createTimer() {
    const init = moment(this.Tramite.fecha_registro)
    if (this.Tramite.estado === 'CONCLUIDO' || this.Tramite.estado === 'ANULADO') {
      this.dateCount = this.duration(init, moment(this.Tramite.fecha_finalizacion))
    }
    else {
      this.dateCount = this.duration(init, moment(new Date()))
      this.timer = setInterval(() => {
        this.dateCount = this.duration(init, moment(new Date()))
      }, 1000)
    }
  }

  duration(inicio: moment.Moment, fin: moment.Moment) {
    const parts: string[] = [];
    const duration = moment.duration(fin.diff(inicio))
    if (duration.years() >= 1) {
      const years = Math.floor(duration.years());
      parts.push(years + " " + (years > 1 ? "años" : "año"));
    }
    if (duration.months() >= 1) {
      const months = Math.floor(duration.months());
      parts.push(months + " " + (months > 1 ? "meses" : "mes"));
    }
    if (duration.days() >= 1) {
      const days = Math.floor(duration.days());
      parts.push(days + " " + (days > 1 ? "dias" : "dia"));
    }
    if (duration.hours() >= 1) {
      const hours = Math.floor(duration.hours());
      parts.push(hours + " " + (hours > 1 ? "horas" : "hora"));
    }
    if (duration.minutes() >= 1) {
      const minutes = Math.floor(duration.minutes());
      parts.push(minutes + " " + (minutes > 1 ? "minutos" : "minuto"));
    }
    if (duration.seconds() >= 1) {
      const seconds = Math.floor(duration.seconds());
      parts.push(seconds + " " + (seconds > 1 ? "segundos" : "segundo"));
    }
    return parts.join(", ")
  }
}
