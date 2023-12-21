import { Component, Input, OnInit } from '@angular/core';
import * as shape from 'd3-shape';
import { Edge, Node, ClusterNode, MiniMapPosition } from '@swimlane/ngx-graph';
import {
  workflowResponse,
  participant,
  statusMail,
} from 'src/app/communication/interfaces';

@Component({
  selector: 'app-graph-workflow',
  templateUrl: './graph-workflow.component.html',
  styleUrls: ['./graph-workflow.component.scss'],
})
export class GraphWorkflowComponent implements OnInit {
  @Input() workflow: workflowResponse[] = [];
  nodes: Node[] = [];
  links: Edge[] = [];
  clusters: ClusterNode[] = [];
  curve = shape.curveLinear;
  minimapPosition: MiniMapPosition = MiniMapPosition.UpperRight;

  constructor() {}

  ngOnInit(): void {
    this.workflow.forEach((element, index) => {
      element.sendings.forEach((send, subindex) => {
        const [status, classEdge, classLink] =
          send.status === statusMail.Rejected
            ? ['Rechazado', 'circle-reject', 'line-reject']
            : send.status === statusMail.Pending
            ? ['Pendiente', 'circle-pending', 'line-pending']
            : ['Recibido', 'circle-success', 'line-success'];

        this.links.push({
          id: `a${subindex}-${index}`,
          source: send.emitter.cuenta._id,
          target: send.receiver.cuenta._id,
          label: `${index + 1}`,
          data: {
            status,
            classEdge,
            classLink,
          },
        });
        this.addNodeIfNotFound(send.emitter);
        this.addNodeIfNotFound(send.receiver);
        this.addClusterIfNotFount(send.emitter);
        this.addClusterIfNotFount(send.receiver);
      });
    });
  }

  addNodeIfNotFound(participant: participant): void {
    const foundUser = this.nodes.find(
      (node) => node.id === participant.cuenta._id
    );
    if (!foundUser) {
      this.nodes.push({
        id: participant.cuenta._id.toString(),
        label: `funcionario-${participant.cuenta._id}`,
        data: {
          dependencia: participant.cuenta.dependencia.nombre,
          institucion: participant.cuenta.dependencia.institucion.nombre,
          officer: participant.fullname,
          jobtitle: participant.jobtitle ? participant.jobtitle : 'Sin cargo',
        },
      });
    }
  }
  addClusterIfNotFount(participant: participant): void {
    const indexFoundInstitution = this.clusters.findIndex(
      (cluster) => cluster.id === participant.cuenta.dependencia.institucion._id
    );
    if (indexFoundInstitution === -1) {
      this.clusters.push({
        id: participant.cuenta.dependencia.institucion._id,
        label: `Institucion: ${participant.cuenta.dependencia.institucion.sigla}`,
        childNodeIds: [participant.cuenta._id],
      });
    } else {
      this.clusters[indexFoundInstitution].childNodeIds?.push(
        participant.cuenta._id
      );
    }
  }
}
