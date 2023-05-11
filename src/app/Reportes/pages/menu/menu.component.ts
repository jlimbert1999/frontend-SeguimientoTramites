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


  constructor(private breakpointObserver: BreakpointObserver, private authService: AuthService) {
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
    createPDFFicha(reportData)


  }


}
