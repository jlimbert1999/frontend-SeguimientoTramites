import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit, ViewChild, AfterViewInit } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { MatLegacyTableDataSource as MatTableDataSource } from '@angular/material/legacy-table';
import { AuthService } from 'src/app/auth/services/auth.service';
import { DialogRemisionComponent } from '../dialog-remision/dialog-remision.component';
import { BandejaSalidaModel_View } from '../models/mail.model';
import { BandejaService } from '../services/bandeja.service';
import { crear_hoja_ruta } from "../pdf/tramites";
import { TramiteService } from '../services/tramite.service';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { ExternosService } from '../services/externos.service';
import { InternosService } from '../services/internos.service';
import { HojaRutaInterna } from '../internos/pdfs/hora-ruta';
import { MatLegacyPaginator as MatPaginator, LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { BandejaSalidaService } from '../services/bandeja-salida.service';
import { async, BehaviorSubject, map, Subject, switchMap } from 'rxjs';

@Component({
  selector: 'app-bandeja-salida',
  templateUrl: './bandeja-salida.component.html',
  styleUrls: ['./bandeja-salida.component.css'],
  animations: [
    trigger('detailExpand', [
      state('collapsed', style({ height: '0px', minHeight: '0' })),
      state('expanded', style({ height: '*' })),
      transition('expanded <=> collapsed', animate('225ms cubic-bezier(0.4, 0.0, 0.2, 1)')),
    ]),
    fadeInOnEnterAnimation({ duration: 500 })
  ],
})
export class BandejaSalidaComponent implements OnInit, AfterViewInit {
  dataSource: BandejaSalidaModel_View[] = []
  displayedColumns = ['grupo', 'alterno', 'tipo', 'estado', 'fecha_envio', 'situacion', 'opciones', 'expand']
  isLoadingResults = true;
  expandedElement: BandejaSalidaModel_View | null;
  resulstLenght: number = 0

  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(
    public dialog: MatDialog,
    private authService: AuthService,
    private tramiteService: TramiteService,
    private externoService: ExternosService,
    private internoService: InternosService,
    private bandejaService: BandejaSalidaService
  ) { }
  ngAfterViewInit(): void {
    this.paginator.pageIndex = this.bandejaService.offset
    this.paginator.pageSize = this.bandejaService.limit
  }

  ngOnInit(): void {
    this.bandejaService.Get().subscribe(data => {
      this.resulstLenght = data.total
      this.dataSource = data.tramites
    })

  }

  generar_hoja_ruta(id_tramite: string, tipo_hoja: 'tramites_externos' | 'tramites_internos') {
    if (tipo_hoja === 'tramites_externos') {
      this.externoService.getOne(id_tramite).subscribe(data => {
        crear_hoja_ruta(data.tramite, data.workflow, tipo_hoja)
      })
    }
    else {
      this.internoService.GetOne(id_tramite).subscribe(data => {
        HojaRutaInterna(data.tramite, data.workflow, tipo_hoja)
      })
    }
  }
  pagination(event: PageEvent) {
    this.bandejaService.offset = event.pageIndex
    this.bandejaService.limit = event.pageSize
    this.bandejaService.Get().subscribe(data => {
      this.resulstLenght = data.total
      this.dataSource = data.tramites
    })
  }


}
