import { Component, Input, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import * as moment from 'moment';
import { Externo } from 'src/app/Tramites/models/Externo.interface';
import { LocationProcedure } from 'src/app/Bandejas/models/workflow.interface';


@Component({
  selector: 'app-info-tramite-externo',
  templateUrl: './info-tramite-externo.component.html',
  styleUrls: ['./info-tramite-externo.component.css']
})
export class InfoTramiteExternoComponent implements OnInit, OnDestroy {
  @Input() Tramite: Externo
  @Input() Location: LocationProcedure[] = []
  timer: any;
  count: any

  constructor(private _location: Location,) {

  }
  ngOnInit(): void {
    this.createTimer(this.Tramite.fecha_registro, this.Tramite.fecha_finalizacion, this.Tramite.estado)
  }



  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  createTimer(fecha_inicio: any, fecha_fin: any | undefined, estado: string,) {
    fecha_inicio = moment(new Date((fecha_inicio)))
    fecha_fin = fecha_fin ? moment(new Date(fecha_fin)) : moment(new Date())
    this.count = this.duration(fecha_inicio, fecha_fin)
    if (estado !== "CONCLUIDO") {
      this.timer = setInterval(() => {
        fecha_fin = moment(new Date())
        this.count = this.duration(fecha_inicio, fecha_fin)
      }, 1000)
    }

  }

  duration(inicio: any, fin: any) {
    let parts: any = [];
    let duration = moment.duration(fin.diff(inicio))
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
