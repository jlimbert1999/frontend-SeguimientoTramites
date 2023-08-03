import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { createListWorkflow } from 'src/app/Bandejas/helpers/ListWorkflow';
import { newWorkflow } from 'src/app/Bandejas/models/newWokflow.mode';
import { ListWorkflow, WorkflowData } from 'src/app/Bandejas/models/workflow.interface';


export interface Workflow {
  emitter: Officer
  message: string
  adjunt: string
  timeWorked: string
  sendDate: string
  sends: {
    receiver: Officer
    timeToAccept: string
    acceptDate: string
    received: boolean
    rejectionReason?: string
  }[]
}
export interface Officer {
  officer: {
    nombre: string
    paterno: string
    materno: string
    cargo: string
  }
  dependencie: string
  institition: string
}

@Component({
  selector: 'app-list-workflow',
  templateUrl: './list-workflow.component.html',
  styleUrls: ['./list-workflow.component.scss']
})
export class ListWorkflowComponent implements OnInit {
  @Input() Workflow: newWorkflow[] = []
  @Input() fecha_registro: string
  ListWorflow: Workflow[] = []
  constructor() { }

  ngOnInit(): void {
    // this.ListWorflow = this.createWorkflow(this.Workflow)
    console.log(this.ListWorflow)
  }

  createWorkflow(workflow: WorkflowData[]): Workflow[] {
    let startDate: string | undefined = this.fecha_registro
    const merged = workflow.reduce((r: any, { tramite, emisor, fecha_envio, motivo, numero_interno, cantidad, ...rest }, index) => {
      const key = `${tramite}-${emisor.cuenta._id}-${fecha_envio}`;
      for (let j = workflow.length - 1; j > 0; j--) {
        if (emisor.cuenta._id === workflow[j].receptor.cuenta._id) {
          startDate = workflow[j].fecha_recibido
          break
        }
      }
      r[key] = r[key] || {
        emitter: {
          officer: emisor.funcionario,
          dependencie: emisor.cuenta.dependencia.nombre,
          institition: emisor.cuenta.dependencia.institucion.sigla
        },
        message: motivo,
        adjunt: cantidad,
        timeWorked: this.createDuration(startDate, fecha_envio),
        sendDate: fecha_envio,
        sends: []
      };
      r[key]["sends"].push({
        receiver: {
          officer: rest.receptor.funcionario,
          dependencie: rest.receptor.cuenta.dependencia.nombre,
          institition: rest.receptor.cuenta.dependencia.institucion.sigla
        },
        timeToAccept: this.createDuration(fecha_envio, rest.fecha_recibido),
        acceptDate: rest.fecha_recibido,
        received: rest.recibido,
        rejectionReason: rest.motivo_rechazo

      })
      return r;
    }, {})
    return Object.values(merged)
  }

  createDuration(inicio: moment.MomentInput, fin: moment.MomentInput) {
    if (!inicio) return 'Aceptacion pendiente'
    if (!fin) return 'Envio pendiente'
    inicio = moment((inicio))
    fin = moment((fin))
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
