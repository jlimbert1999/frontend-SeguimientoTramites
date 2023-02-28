import { Component, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BandejaService } from '../../Tramites/services/bandeja.service';
import { InternosService } from '../../Tramites/services/internos.service';
import { Location } from '@angular/common';
import { slideInLeftOnEnterAnimation } from 'angular-animations';
import * as moment from 'moment';

@Component({
  selector: 'app-mail-ficha-interno',
  templateUrl: './mail-ficha-interno.component.html',
  styleUrls: ['./mail-ficha-interno.component.css'],
  animations: [
    slideInLeftOnEnterAnimation({ duration: 500 })
  ]
})
export class MailFichaInternoComponent implements OnInit, OnDestroy {
  Detalles: any
  Tramite: any
  Workflow: any

  timer: any;
  count: any

  constructor(
    private activateRoute: ActivatedRoute,
    private internoService: InternosService,
    private bandejaService: BandejaService,
    private _location: Location) { }


  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      if (params['id']) {
        this.bandejaService.getDetalisMail(params['id']).subscribe(data => {
          this.Detalles = data
          this.bandejaService.getMailInterno(data.tramite).subscribe(data => {
            this.Tramite = data.tramite
            this.Workflow = data.workflow
            this.createTimer(this.Tramite.fecha_registro, this.Tramite.fecha_finalizacion, this.Tramite.estado)
          })
        })
      }
    })
  }
  regresar() {
    this._location.back();
  }
  setNewState(state: string) {
    this.Tramite.estado = state
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
  ngOnDestroy(): void {
    clearInterval(this.timer);
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
