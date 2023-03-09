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
    let fecha_inicio: any, fecha_fin
    if (this.Workflow.length > 0) {
      let puntero = this.Workflow[0].emisor.cuenta._id
      fecha_inicio = this.fecha_registro
      fecha_fin = this.Workflow[0].fecha_envio
      this.Iteraciones.push({
        emisor: this.Workflow[0].emisor,
        duracion: this.crear_duracion(fecha_inicio, fecha_fin),
        motivo: this.Workflow[0].motivo,
        cantidad: this.Workflow[0].cantidad,
        receptores: []
      })

      this.Workflow.forEach((element, index) => {
        if (puntero === element.emisor.cuenta._id) {
          let respuesta = 'Pendiente'
          if (element.recibido != null) {
            respuesta = this.crear_duracion(element.fecha_envio, element.fecha_recibido)
          }
          this.Iteraciones[this.Iteraciones.length - 1].receptores.push({ receptor: element.receptor, respuesta })
        }
        else {
          puntero = element.emisor.cuenta._id
          fecha_fin = element.fecha_envio
          for (let i = index; i >= 0; i--) {
            if (this.Workflow[i].receptor.cuenta._id === puntero) {
              fecha_inicio = this.Workflow[i].fecha_recibido
              break
            }
          }
          let respuesta = 'Pendiente'
          if (element.recibido != null) {
            respuesta = this.crear_duracion(element.fecha_envio, element.fecha_recibido)
          }
        
          this.Iteraciones.push({
            emisor: element.emisor,
            duracion: this.crear_duracion(fecha_inicio, fecha_fin),
            motivo: element.motivo,
            cantidad: element.cantidad,
            receptores: [{ receptor: element.receptor, respuesta }]
          })
        }
      })
    }
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
    //   parts.push(seconds + " " + (seconds > 1 ? "segundos" : "segundo"));
    // }
    return parts.join(", ")
  }

}
