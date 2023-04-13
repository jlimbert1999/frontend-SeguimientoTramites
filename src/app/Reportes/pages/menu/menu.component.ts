import { BreakpointObserver, Breakpoints } from '@angular/cdk/layout';
import { Component } from '@angular/core';
import { FormControl, FormGroup } from '@angular/forms';
import { map } from 'rxjs';

@Component({
  selector: 'app-menu',
  templateUrl: './menu.component.html',
  styleUrls: ['./menu.component.css']
})
export class MenuComponent {
  isMobile: boolean = false
  typesOfReports: string[] = ['unidad', 'ficha', 'estado', 'solicitante']
  typeTramiteForReport: 'interno' | 'externo' = 'externo'
  reportType: string
  displayedColumns = [
    { key: 'alterno', titulo: 'Alterno' },
    { key: 'detalle', titulo: 'Detalle' },
    { key: 'estado', titulo: 'Estado' },
    { key: 'fecha_registro', titulo: 'Fecha' }
  ];

  dataSource: any[] = []
  range = new FormGroup({
    start: new FormControl<Date | null>(null),
    end: new FormControl<Date | null>(null),
  });



  constructor(private breakpointObserver: BreakpointObserver) {
   
  }

  selectTypeReport(typeReport: string) {
    this.reportType = typeReport
  }
  recibirData(data: any) {
    this.dataSource = []
    this.dataSource = [...data]

  }

}
