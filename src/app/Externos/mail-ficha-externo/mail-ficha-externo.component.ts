import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { BandejaService } from '../../Tramites/services/bandeja.service';
import { Location } from '@angular/common';
import { MailDetails } from '../../Tramites/models/mail.model';
import { slideInLeftOnEnterAnimation } from 'angular-animations';
import * as moment from 'moment';

@Component({
  selector: 'app-mail-ficha-externo',
  templateUrl: './mail-ficha-externo.component.html',
  styleUrls: ['./mail-ficha-externo.component.css'],
  animations: [
    slideInLeftOnEnterAnimation({ duration: 500 })
  ]
})
export class MailFichaExternoComponent implements OnInit {
  Tramite: any
  Workflow: any[] = []
  Detalles: MailDetails

  timer: any;
  count: any

  constructor(
    private activateRoute: ActivatedRoute,
    private bandejaService: BandejaService,
    private _location: Location,
  ) {
  }

  ngOnInit(): void {
    this.activateRoute.params.subscribe(params => {
      if (params['id']) {
        this.bandejaService.getDetalisMail(params['id']).subscribe(data => {
          this.Detalles = data
          this.bandejaService.getMailExterno(data.tramite).subscribe(data => {
            this.Tramite = data.tramite
            this.Workflow = data.workflow
            if (this.Tramite.estado === "CONCLUIDO") {
              this.count = this.create_duration(this.Tramite.fecha_registro, this.Tramite.fecha_finalizacion)
            }
            else {
              this.count = this.create_timer(this.Tramite.fecha_registro)
              this.timer = setInterval(() => {
                this.count = this.create_timer(this.Tramite.fecha_registro)
              }, 1000)
            }
          })
        })
      }
    })
  }
  setNewState(state: string) {
    this.Tramite.estado = state
  }
  regresar() {
    this._location.back();
  }

  ngOnDestroy(): void {
    clearInterval(this.timer);
  }

  create_duration(inicio: any, fin: any) {
    inicio = moment(new Date((inicio)))
    fin = moment(new Date(fin))
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
    else {
      const seconds = Math.floor(duration.seconds());
      parts.push(seconds + " " + (seconds > 1 ? "segundos" : "segundo"));
    }
    return parts.join(", ")
  }

  create_timer(inicio: any) {
    inicio = moment(new Date((inicio)))
    let fin = moment(new Date())
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
