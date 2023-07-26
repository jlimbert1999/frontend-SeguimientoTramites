import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { createPDFSolicitante } from '../../pdf/reporte-solicitante';
import { SendDataReportEvent } from '../../models/sendData.model';
import { createPDFUnidad } from '../../pdf/reporte-unidad';
import { fadeInDownAnimation, fadeInDownOnEnterAnimation, fadeInOnEnterAnimation } from 'angular-animations';
import { createPDFFicha } from '../../pdf/reporte-fichas';
import { createPDFUsuario } from '../../pdf/reporte-usuario';

import { PDF_FichaExterno, PDF_FichaInterno } from '../../pdf/reporte-ficha-externa';
import { createListWorkflow } from 'src/app/Bandejas/helpers/ListWorkflow';
import { ExternosService } from 'src/app/procedures/services/externos.service';
import { InternosService } from 'src/app/procedures/services/internos.service';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.scss'],
  animations: [
    fadeInDownOnEnterAnimation(),
  ]
})
export class MenuComponent implements OnDestroy {
  destroyed = new Subject<void>();
  isMobile: boolean = false
  typesOfReports: string[] = []
  reportType: string
  displayedColumns: any[] = []
  dataSource: any[] = []
  group: string


  constructor(
    private breakpointObserver: BreakpointObserver,
    private authService: AuthService,
    private externoService: ExternosService,
    private internoService: InternosService
  ) {
    this.breakpointObserver
      .observe([
        Breakpoints.XSmall,
        Breakpoints.Small,
      ])
      .pipe(takeUntil(this.destroyed))
      .subscribe(({ matches }) => {
        this.isMobile = matches
      });
    this.typesOfReports = this.authService.resources.filter(resourse => resourse.includes('reporte'))
    this.typesOfReports = this.typesOfReports.map(typeReport => {
      return typeReport.split('-')[1]
    })
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  selectTypeReport(typeReport: string) {
    this.dataSource = []
    this.reportType = typeReport
  }

  receiveData(reportData: SendDataReportEvent) {
    this.displayedColumns = reportData.group === 'tramites_externos'
      ? [
        { key: 'alterno', titulo: 'Alterno' },
        { key: 'detalle', titulo: 'Detalle' },
        { key: 'estado', titulo: 'Estado' },
        { key: 'fecha_registro', titulo: 'Fecha' }
      ]
      : this.displayedColumns = [
        { key: 'alterno', titulo: 'Alterno' },
        { key: 'detalle', titulo: 'Detalle' },
        { key: 'estado', titulo: 'Estado' },
        { key: 'remitente', titulo: 'Remitente' },
        { key: 'destinatario', titulo: 'Remitente' },
        { key: 'cite', titulo: 'Cite' },
        { key: 'fecha_registro', titulo: 'Fecha' }
      ];
    this.dataSource = []
    this.dataSource = [...reportData.data]
    this.group = reportData.group
    createPDFFicha(reportData)
  }

  generateFicha(data: any) {
    if (this.group === 'tramites_externos') {
      this.externoService.getAllDataExternalProcedure(data._id).subscribe(data => {
        // const List = data.workflow.length > 0
        //   ? createListWorkflow(data.workflow, [{ id_root: data.workflow[0].emisor.cuenta._id, startDate: data.procedure.fecha_registro }], [])
        //   : []
        // PDF_FichaExterno(data.procedure, List, data.location)
      })
    }
    else {
      this.internoService.getAllDataInternalProcedure(data._id).subscribe(data => {
        const List = data.workflow.length > 0
          ? createListWorkflow(data.workflow, [{ id_root: data.workflow[0].emisor.cuenta._id, startDate: data.procedure.fecha_registro }], [])
          : []
        PDF_FichaInterno(data.procedure, List, data.location)
      })
    }

  }



}
