import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';

@Component({
  selector: 'app-list-workflow',
  templateUrl: './list-workflow.component.html',
  styleUrls: ['./list-workflow.component.css']
})
export class ListWorkflowComponent implements OnInit {
  @Input() Workflow: any[]
  @Input() fecha_registro: string
  constructor() { }

  ngOnInit(): void {
    let fecha_inicio, fecha_fin
    this.Workflow.forEach((element, index) => {
      if (index !== 0) {
        fecha_inicio = this.Workflow[index - 1].fecha_recibido
      }
      else {
        fecha_inicio = this.fecha_registro
      }
      fecha_fin = element.fecha_envio
      this.Workflow[index]['duracion'] = this.crear_duracion(fecha_inicio, fecha_fin)
      if (element.recibido === true || element.recibido === false) {
        this.Workflow[index]['respuesta'] = this.crear_duracion(element.fecha_envio, element.fecha_recibido)
      }
      else {
        this.Workflow[index]['respuesta'] = 'Pendiente'
      }
    })
  }
  crear_duracion(inicio: any, fin: any) {
    inicio = moment(new Date((inicio)))
    fin = moment(new Date((fin)))
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

    // if (duration.seconds() >= 1) {
    //   const seconds = Math.floor(duration.seconds());
    //   parts.push(seconds + " " + (seconds > 1 ? "seconds" : "second"));
    // }
    return parts.join(", ")
  }

}
