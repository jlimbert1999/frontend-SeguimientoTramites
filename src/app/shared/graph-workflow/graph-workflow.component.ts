import { Component, Input, OnInit } from '@angular/core';
import * as moment from 'moment';
import { ExternosService } from 'src/app/Tramites/services/externos.service';

@Component({
  selector: 'app-graph-workflow',
  templateUrl: './graph-workflow.component.html',
  styleUrls: ['./graph-workflow.component.css'],
  
})
export class GraphWorkflowComponent implements OnInit {
  @Input() Workflow: any[]
  nodos: any[] = []
  links: any[] = []
  clusters: { id: string, label: string, childNodeIds: string[] }[] = []
  constructor(private externoService: ExternosService) { }

  ngOnInit(): void {
    this.crear_workflow(this.Workflow)
  }

  crear_workflow(workflow: any[]) {
    let instituciones: any[] = []
    let found
    let foundInstitucion
    let fecha_inicio, fecha_fin
    workflow.forEach((element, index) => {
      found = this.nodos.some(user => user.id == element.emisor.cuenta._id.toString());
      if (!found) {
        this.nodos.push({
          id: element.emisor.cuenta._id,
          label: `funcionario-${element.emisor.cuenta._id}`,
          data: {
            dependencia: element.emisor.cuenta.dependencia.nombre,
            institucion: element.emisor.cuenta.dependencia.institucion.sigla,
            funcionario: element.emisor.funcionario,
            cargo: element.emisor.cargo
          },
          position: `x${index}`
        })
        foundInstitucion = instituciones.some(inst => inst.id == element.emisor.cuenta.dependencia.institucion.sigla.toString().toUpperCase());
        if (!foundInstitucion) {
          instituciones.push({
            id: element.emisor.cuenta.dependencia.institucion.sigla.toString().toUpperCase(),
            label: `Institucion: ${element.emisor.cuenta.dependencia.institucion.sigla.toUpperCase()}`,
            childNodeIds: []
          })
        }
      }
      found = this.nodos.some(user => user.id == element.receptor.cuenta._id.toString());
      if (!found) {
        this.nodos.push({
          id: element.receptor.cuenta._id,
          label: `funcionario-${element.receptor.cuenta._id}`,
          data: {
            dependencia: element.receptor.cuenta.dependencia.nombre,
            institucion: element.receptor.cuenta.dependencia.institucion.sigla,
            funcionario: element.receptor.funcionario,
            cargo: element.receptor.cargo
          },
          position: `x${index}`
        })
        foundInstitucion = instituciones.some(inst => inst.id == element.receptor.cuenta.dependencia.institucion.sigla.toString().toUpperCase());
        if (!foundInstitucion) {
          instituciones.push({
            id: element.receptor.cuenta.dependencia.institucion.sigla.toString().toUpperCase(),
            label: `Institucion: ${element.receptor.cuenta.dependencia.institucion.sigla.toUpperCase()}`,
            childNodeIds: []
          })
        }
      }
      this.links.push({
        id: `a${index}`,
        source: element.emisor.cuenta._id,
        target: element.receptor.cuenta._id,
        label: `${index + 1}`,
        status: element.recibido === true ? 'Enviado' : element.recibido === false ? 'Rechazado' : 'Pendiente....',
        recibido: element.recibido
      })
    });
    instituciones.forEach((clus, i) => {
      this.nodos.forEach((nodo: any) => {
        if (clus.id === nodo.data.institucion) {
          instituciones[i].childNodeIds.push(nodo.id)
        }
      })
    })
    this.clusters = instituciones

  }

  
}
