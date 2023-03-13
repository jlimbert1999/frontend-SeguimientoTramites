import { NestedTreeControl } from '@angular/cdk/tree';
import { Component, Input, OnInit } from '@angular/core';
import { MatTreeNestedDataSource } from '@angular/material/tree';
import * as moment from 'moment';
import { WorkflowData } from 'src/app/Externos/models/Externo.interface';

interface ListGroupware {
  parentId?: string
  _id: string
  funcionario: Object
  duracion: string,
  recibido?: boolean,
  motivo: string,
  cantidad: string,
  numero_interno: string,
  fecha_envio: string,
  fecha_recibido?: string,
  children?: ListGroupware[]
}
@Component({
  selector: 'app-list-workflow',
  templateUrl: './list-workflow.component.html',
  styleUrls: ['./list-workflow.component.css']
})
export class ListWorkflowComponent implements OnInit {
  @Input() Workflow: WorkflowData[]
  @Input() fecha_registro: string
  treeControl = new NestedTreeControl<ListGroupware>(node => node.children);
  dataSource = new MatTreeNestedDataSource<ListGroupware>();

  constructor() { }
  hasChild = (_: number, node: ListGroupware) => !!node.children && node.children.length > 0;

  ngOnInit(): void {
    let list: ListGroupware[] = []
    let next: WorkflowData = this.Workflow[0]
    for (let i = 0; i < this.Workflow.length; i++) {
      for (let j = i; j < this.Workflow.length; j++) {
        // date init when user acept tramite
        if (this.Workflow[i].receptor.cuenta._id == this.Workflow[j].emisor.cuenta._id) {
          next = this.Workflow[j]
          break
        }
      }
      list.push({
        parentId: this.Workflow[i].emisor.cuenta._id,
        _id: this.Workflow[i].receptor.cuenta._id,
        funcionario: this.Workflow[i].receptor.funcionario,
        duracion: this.crear_duracion(this.Workflow[i].fecha_recibido, next.fecha_envio),
        recibido: this.Workflow[i].recibido,
        motivo: next.motivo,
        cantidad: next.cantidad,
        numero_interno: next.numero_interno,
        fecha_recibido: this.Workflow[i].fecha_recibido,
        fecha_envio: next.fecha_envio
      })
    }
    // insert List and root node
    const arrayToTree: any = (arr: ListGroupware[], parent = this.Workflow[0].emisor.cuenta._id) =>
      arr.filter(item => item.parentId === parent)
        .map((child) => ({
          ...child, children: arrayToTree(arr,
            child._id)
        }));

    //     // insert all vaues in root node
    let data: ListGroupware[] = [
      {
        _id: this.Workflow[0].emisor.cuenta._id,
        funcionario: this.Workflow[0].emisor.funcionario,
        duracion: this.crear_duracion(this.fecha_registro, this.Workflow[0].fecha_envio),
        recibido: this.Workflow[0].recibido,
        motivo: this.Workflow[0].motivo,
        cantidad: this.Workflow[0].cantidad,
        numero_interno: this.Workflow[0].numero_interno,
        fecha_envio: this.Workflow[0].fecha_envio,
        children: arrayToTree(list)
      }
    ]
    this.dataSource.data = data
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
    if (duration.seconds() >= 1) {
      const seconds = Math.floor(duration.seconds());
      parts.push(seconds + " " + (seconds > 1 ? "segundos" : "segundo"));
    }
    return parts.join(", ")
  }

}
