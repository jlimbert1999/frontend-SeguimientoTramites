import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { WorkflowData } from 'src/app/Externos/models/Externo.interface';

@Component({
  selector: 'app-list-workflow',
  templateUrl: './list-workflow.component.html',
  styleUrls: ['./list-workflow.component.css']
})
export class ListWorkflowComponent implements OnInit {
  @Input() Workflow: WorkflowData[]
  @Input() fecha_registro: string

  Iteraciones: any[] = []
  constructor() { }

  ngOnInit(): void {
    let fecha_inicio, fecha_fin
    this.Workflow.forEach((element, index) => {
      let pos = this.Iteraciones.findIndex(iteracion => iteracion.cuenta._id === element.emisor.cuenta._id)
      fecha_inicio = this.Workflow[index - 1] ? this.Workflow[index - 1].fecha_recibido : this.fecha_registro
      fecha_fin = element.fecha_envio
      if (pos !== -1) {
        this.Iteraciones[pos].receptores.push(
          {
            ...element.receptor,
            duracion: this.crear_duracion(fecha_inicio, fecha_fin)
          }
        )
      }
      else {
        this.Iteraciones.push({
          ...element.emisor,
          duracion: this.crear_duracion(fecha_inicio, fecha_fin),
          motivo: element.motivo,
          cantidad: element.cantidad,
          numero_interno: element.numero_interno,
          recibido: element.recibido,
          receptores: [{
            ...element.receptor,
            duracion: this.crear_duracion(fecha_inicio, fecha_fin)
          }]
        })
      }
    })
    console.log(this.Iteraciones)
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
