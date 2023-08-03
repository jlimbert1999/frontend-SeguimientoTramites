import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import * as shape from 'd3-shape';
import { WorkflowData } from 'src/app/Bandejas/models/workflow.interface';
import { Edge, Node, ClusterNode } from '@swimlane/ngx-graph';
import { newWorkflow } from 'src/app/Bandejas/interfaces/workflow.interface';

@Component({
  selector: 'app-graph-workflow',
  templateUrl: './graph-workflow.component.html',
  styleUrls: ['./graph-workflow.component.scss'],

})
export class GraphWorkflowComponent implements OnInit {
  @Input() Workflow: newWorkflow[]
  nodos: Node[] = []
  links: Edge[] = []
  clusters: ClusterNode[] = []

  curve: any = shape.curveLinear;

  constructor() { }

  ngOnInit(): void {
    // this.crear_workflow(this.Workflow)
    this.Workflow.forEach((element) => {
      element.sendings.forEach((send, index) => {
        console.log(send);
        this.links.push({
          id: `a${index}`,
          source: send.emisor.cuenta._id,
          target: send.receptor.cuenta._id,
          label: `${index + 1}`,
          data: {
            status: send.recibido === true ? 'Enviado' : send.recibido === false ? 'Rechazado' : 'Pendiente....',
            recibido: send.recibido
          }
        })
        const foundEmitter = this.nodos.some(user => user.id == send.emisor.cuenta._id);
        if (!foundEmitter) {
          this.nodos.push({
            id: send.emisor.cuenta._id.toString(),
            label: `funcionario-${send.emisor.cuenta._id}`,
            data: {
              dependencia: send.emisor.cuenta.dependencia.nombre,
              institucion: send.emisor.cuenta.dependencia.institucion.nombre,
              funcionario: send.emisor.fullname,
              cargo: send.emisor.jobtitle ? send.emisor.jobtitle : 'Sin cargo'
            }
          })
        }
        const foundReceiver = this.nodos.some(user => user.id == send.receptor.cuenta._id);
        if (!foundReceiver) {
          this.nodos.push({
            id: send.receptor.cuenta._id.toString(),
            label: `funcionario-${send.receptor.cuenta._id}`,
            data: {
              dependencia: send.receptor.cuenta.dependencia.nombre,
              institucion: send.receptor.cuenta.dependencia.institucion.nombre,
              funcionario: send.receptor.fullname,
              cargo: send.receptor.jobtitle ? send.receptor.jobtitle : 'Sin cargo'
            }
          })
        }
      })

    })
    console.log(this.nodos);
    console.log(this.links);
  }



  // crear_workflow(workflow: WorkflowData[]) {
  //   let instituciones: any[] = []
  //   let found
  //   let foundInstitucion
  //   workflow.forEach((element, index) => {
  //     found = this.nodos.some(user => user.id == element.emisor.cuenta._id.toString());
  //     if (!found) {
  //       this.nodos.push({
  //         id: element.emisor.cuenta._id,
  //         label: `funcionario-${element.emisor.cuenta._id}`,
  //         data: {
  //           dependencia: element.emisor.cuenta.dependencia.nombre,
  //           institucion: element.emisor.cuenta.dependencia.institucion.sigla,
  //           funcionario: element.emisor.funcionario,
  //           cargo: element.emisor.funcionario ? element.emisor.funcionario.cargo : '----'
  //         },
  //       })
  //       foundInstitucion = instituciones.some(inst => inst.id == element.emisor.cuenta.dependencia.institucion.sigla.toString().toUpperCase());
  //       if (!foundInstitucion) {
  //         instituciones.push({
  //           id: element.emisor.cuenta.dependencia.institucion.sigla.toString().toUpperCase(),
  //           label: `Institucion: ${element.emisor.cuenta.dependencia.institucion.sigla.toUpperCase()}`,
  //           childNodeIds: []
  //         })
  //       }
  //     }
  //     found = this.nodos.some(user => user.id == element.receptor.cuenta._id.toString());
  //     if (!found) {
  //       this.nodos.push({
  //         id: element.receptor.cuenta._id,
  //         label: `funcionario-${element.receptor.cuenta._id}`,
  //         data: {
  //           dependencia: element.receptor.cuenta.dependencia.nombre,
  //           institucion: element.receptor.cuenta.dependencia.institucion.sigla,
  //           funcionario: element.receptor.funcionario,
  //           cargo: element.receptor.funcionario ? element.receptor.funcionario.cargo : '----'
  //         },
  //       })
  //       foundInstitucion = instituciones.some(inst => inst.id == element.receptor.cuenta.dependencia.institucion.sigla.toString().toUpperCase());
  //       if (!foundInstitucion) {
  //         instituciones.push({
  //           id: element.receptor.cuenta.dependencia.institucion.sigla.toString().toUpperCase(),
  //           label: `Institucion: ${element.receptor.cuenta.dependencia.institucion.sigla.toUpperCase()}`,
  //           childNodeIds: []
  //         })
  //       }
  //     }
  //     this.links.push({
  //       id: `a${index}`,
  //       source: element.emisor.cuenta._id,
  //       target: element.receptor.cuenta._id,
  //       label: `${index + 1}`,
  //       status: element.recibido === true ? 'Enviado' : element.recibido === false ? 'Rechazado' : 'Pendiente....',
  //       recibido: element.recibido
  //     })
  //   });
  //   instituciones.forEach((clus, i) => {
  //     this.nodos.forEach((nodo: any) => {
  //       if (clus.id === nodo.data.institucion) {
  //         instituciones[i].childNodeIds.push(nodo.id)
  //       }
  //     })
  //   })
  //   this.clusters = instituciones
  // }
}
