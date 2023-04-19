import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component, OnDestroy } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { Observable, Subject, map, takeUntil } from 'rxjs';
import { AuthService } from 'src/app/auth/services/auth.service';
import { createPDFSolicitante } from '../../pdf/reporte-solicitante';
import { SendDataReportEvent } from '../../models/sendData.model';
import { createPDFUnidad } from '../../pdf/reporte-unidad';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
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
    this.typesOfReports = this.authService.account.resources.filter(resourse => resourse.includes('reporte'))
    this.typesOfReports = this.typesOfReports.map(typeReport => {
      return typeReport.split('-')[1]
    })
  }

  ngOnDestroy() {
    this.destroyed.next();
    this.destroyed.complete();
  }

  selectTypeReport(typeReport: string) {
    this.reportType = typeReport
  }

  receiveData(data: any) {
    console.log(data);
    if (data.typeTramiteForReport === 'externo') {
      this.displayedColumns = [
        { key: 'alterno', titulo: 'Alterno' },
        { key: 'detalle', titulo: 'Detalle' },
        { key: 'estado', titulo: 'Estado' },
        { key: 'fecha_registro', titulo: 'Fecha' }
      ];
    }
    else if (data.group === 'tramites_internos') {
      this.displayedColumns = [
        { key: 'alterno', titulo: 'Alterno' },
        { key: 'detalle', titulo: 'Detalle' },
        { key: 'estado', titulo: 'Estado' },
        { key: 'remitente', titulo: 'Remitente' },
        { key: 'destinatario', titulo: 'Remitente' },
        { key: 'cite', titulo: 'Cite' },
        { key: 'fecha_registro', titulo: 'Fecha' }
      ];
    }
    this.dataSource = []
    this.dataSource = [...data.data]
    switch (this.reportType) {
      case 'solicitante':
        createPDFSolicitante(data.paramsForSearch, this.dataSource)
        break;
      case 'unidad':
        createPDFUnidad(data)
        break;

      default:
        break;
    }

  }


}
