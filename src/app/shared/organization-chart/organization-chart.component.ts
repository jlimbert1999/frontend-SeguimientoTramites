import { Component, OnInit } from '@angular/core';
import { DagreNodesOnlyLayout, Edge, Layout } from '@swimlane/ngx-graph';
import { UsuariosService } from 'src/app/Configuraciones/services/usuarios.service';
import * as shape from 'd3-shape';
import { UsuarioDialogComponent } from 'src/app/Configuraciones/pages/cuentas/usuario-dialog/usuario-dialog.component';
import { MatDialog } from '@angular/material/dialog';


@Component({
  selector: 'app-organization-chart',
  templateUrl: './organization-chart.component.html',
  styleUrls: ['./organization-chart.component.css']
})
export class OrganizationChartComponent implements OnInit {

  public nodes: any[] = [];
  public links: Edge[] = [];
  public layoutSettings = {
    orientation: 'TB'
  };
  public curve: any = shape.curveLinear;
  public layout: Layout = new DagreNodesOnlyLayout();

  constructor(private funcionarioService: UsuariosService, public dialog: MatDialog,) { }
  ngOnInit(): void {
    this.funcionarioService.get(500, 0).subscribe(data => {
      for (const employee of data.funcionarios) {
        const node: any = {
          id: employee._id,
          label: `${employee.nombre} ${employee.paterno} ${employee.materno}`.toUpperCase(),
          data: {
            office: employee.cargo,
          }
        };

        this.nodes.push(node);
      }

      for (const employee of data.funcionarios) {
        if (!employee.superior) {
          continue;
        }
        const edge: Edge = {
          source: employee.superior,
          target: employee._id,
          label: '',
          data: {
            linkText: 'Manager of'
          }
        };

        this.links.push(edge);
      }
    })
  }
  open() {
    this.dialog.open(UsuarioDialogComponent, {
      width: '900px',
    });
  }



}
