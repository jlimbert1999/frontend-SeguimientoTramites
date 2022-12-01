import { animate, state, style, transition, trigger } from '@angular/animations';
import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { AuthService } from 'src/app/auth/services/auth.service';
import { DialogRemisionComponent } from '../dialog-remision/dialog-remision.component';
import { BandejaSalidaModel_View } from '../models/mail.model';
import { BandejaService } from '../services/bandeja.service';
import { crear_hoja_ruta } from "../../generacion_pdfs/tramites";

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
    private authService: AuthService
  ) { }

  ngOnInit(): void {

    this.bandejaService.obtener_bandejaSalida().subscribe(tramites => {
      console.log(tramites)
      this.dataSource = tramites
      this.isLoadingResults = false

    })
  }
  generar_hoja_ruta(){
    crear_hoja_ruta()
  }

  reenviar_tramite(elemento: BandejaSalidaModel_View) {
    const dialogRef = this.dialog.open(DialogRemisionComponent, {
      width: '700px',
      data: {
        envio: {
          _id: elemento.tramite._id,
          tipo: elemento.tipo,
          estado: elemento.tramite.estado,
          tipo_tramite: elemento.tramite.tipo_tramite.nombre,
          alterno: elemento.tramite.alterno
        },
        reenvio: {
          cuenta_receptor: elemento.cuenta_receptor._id,
          cuenta_emisor: this.authService.Detalles_Cuenta.id_cuenta,
          tramite: elemento.tramite._id
        }
      }

    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.bandejaService.obtener_bandejaEntrada().subscribe()
      }
    });
  }

}
