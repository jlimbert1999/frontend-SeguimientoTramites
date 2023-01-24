import { Component, OnDestroy, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { slideInLeftOnEnterAnimation } from 'angular-animations';
import { ActivatedRoute } from '@angular/router';
import { InternosService } from '../../services/internos.service';
import * as moment from 'moment';
import { AllInfoOneInterno } from '../models/interno.model';

@Component({
  selector: 'app-ficha-interno',
  templateUrl: './ficha-interno.component.html',
  styleUrls: ['./ficha-interno.component.css'],
  animations: [
    slideInLeftOnEnterAnimation({ duration: 500 })
  ]
})
export class FichaInternoComponent implements OnInit, OnDestroy {
  Tramite: AllInfoOneInterno
  Workflow: any
  timer: any;
  count: any
  constructor(
    private _location: Location,
    private activateRoute: ActivatedRoute,
    private internoService: InternosService) { }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      if (params['id']) {
        this.internoService.GetOne(params['id']).subscribe(data => {
          this.Tramite = data.tramite
          this.Workflow = data.workflow
          this.createTimer(this.Tramite.fecha_registro, this.Tramite.fecha_finalizacion, this.Tramite.estado)
        })
       
      }
    })
  }
  regresar() {
    this._location.back();
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
