import { Component, Input, OnInit } from '@angular/core';
import * as shape from 'd3-shape';
import { Edge, Node, ClusterNode, MiniMapPosition } from '@swimlane/ngx-graph';
import { newWorkflow, participant } from 'src/app/Bandejas/interfaces/workflow.interface';

@Component({
  selector: 'app-graph-workflow',
  templateUrl: './graph-workflow.component.html',
  styleUrls: ['./graph-workflow.component.scss'],

})
export class GraphWorkflowComponent implements OnInit {
  @Input() Workflow: newWorkflow[] = []
  nodes: Node[] = []
  links: Edge[] = []
  clusters: ClusterNode[] = []
  curve = shape.curveLinear;
  minimapPosition: MiniMapPosition = MiniMapPosition.UpperLeft

  constructor() { }

  ngOnInit(): void {
    this.Workflow.forEach((element, index) => {
      element.sendings.forEach((send, subindex) => {
        this.links.push({
          id: `a${subindex}-${index}`,
          source: send.emisor.cuenta._id,
          target: send.receptor.cuenta._id,
          label: `${index + 1}`,
          data: {
            status: send.recibido === true ? 'Enviado' : send.recibido === false ? 'Rechazado' : 'Pendiente....',
            recibido: send.recibido
          }
        })
        this.addNodeIfNotFound(send.emisor)
        this.addNodeIfNotFound(send.receptor)
        this.addClusterIfNotFount(send.emisor)
        this.addClusterIfNotFount(send.receptor)
      })
    })
  }

  addNodeIfNotFound(participant: participant): void {
    const foundUser = this.nodes.find((node) => node.id === participant.cuenta._id);
    if (!foundUser) {
      this.nodes.push({
        id: participant.cuenta._id.toString(),
        label: `funcionario-${participant.cuenta._id}`,
        data: {
          dependencia: participant.cuenta.dependencia.nombre,
          institucion: participant.cuenta.dependencia.institucion.nombre,
          officer: participant.fullname,
          jobtitle: participant.jobtitle ? participant.jobtitle : 'Sin cargo'
        }
      });
    }
  }
  addClusterIfNotFount(participant: participant): void {
    const indexFoundInstitution = this.clusters.findIndex((cluster) => cluster.id === participant.cuenta.dependencia.institucion._id);
    if (indexFoundInstitution === -1) {
      this.clusters.push({
        id: participant.cuenta.dependencia.institucion._id,
        label: `Institucion: ${participant.cuenta.dependencia.institucion.sigla}`,
        childNodeIds: [participant.cuenta._id]
      });
    }
    else {
      this.clusters[indexFoundInstitution].childNodeIds?.push(participant.cuenta._id)
    }
  }
}
