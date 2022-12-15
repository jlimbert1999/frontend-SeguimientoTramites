import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/auth/services/auth.service';
import { DialogRemisionComponent } from '../dialog-remision/dialog-remision.component';
import { BandejaSalidaModel_View } from '../models/mail.model';
import { BandejaService } from '../services/bandeja.service';
import { crear_hoja_ruta } from "../pdf/tramites";
import { TramiteService } from '../services/tramite.service';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { ExternosService } from '../services/externos.service';

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
export class BandejaSalidaComponent implements OnInit {
  dataSource: BandejaSalidaModel_View[] = []
  displayedColumns = ['grupo', 'alterno', 'tipo', 'estado', 'receptor', 'fecha_envio', 'situacion', 'opciones', 'expand']
  isLoadingResults = true;
  expandedElement: BandejaSalidaModel_View | null;

  constructor(
    private bandejaService: BandejaService,
    public dialog: MatDialog,
    private authService: AuthService,
    private tramiteService: TramiteService,
    private externoService: ExternosService
  ) { }

  ngOnInit(): void {

    this.bandejaService.obtener_bandejaSalida().subscribe(tramites => {
      this.dataSource = tramites
      this.isLoadingResults = false

    })
  }
  generar_hoja_ruta(id_tramite: string, tipo_hoja: 'tramites_externos' | 'tramites_internos') {
    this.externoService.getExterno(id_tramite).subscribe(data => {
      crear_hoja_ruta(data.tramite, data.workflow, tipo_hoja)
    })
  }

}
