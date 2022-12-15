import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { TramiteService } from '../services/tramite.service';
import { DialogExternoComponent } from './dialog-externo/dialog-externo.component';
import { crear_ficha_tramite, crear_hoja_ruta } from 'src/app/Tramites/pdf/tramites';
import { DialogRemisionComponent } from '../dialog-remision/dialog-remision.component';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ExternoData, ExternoModel } from '../models/externo.model';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { ExternosService } from '../services/externos.service';
import { catchError, map, of, startWith, switchMap } from 'rxjs';

@Component({
  selector: 'app-externos',
  templateUrl: './externos.component.html',
  styleUrls: ['./externos.component.css'],
  animations: [
    fadeInOnEnterAnimation({ duration: 500 })
  ]

})
export class ExternosComponent implements OnInit {
  data: ExternoData[] = []
  displayedColumns: string[] = ['ubicacion', 'alterno', 'tramite', 'descripcion', 'estado', 'solicitante', 'fecha_registro', 'opciones'];
  dataSource: ExternoData[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  resultsLength = 0;
  isRateLimitReached = false;
  encargado_actual = this.authService.Detalles_Cuenta


  constructor(
    public dialog: MatDialog,
    private toastr: ToastrService,
    public authService: AuthService,
    public externoService: ExternosService
  ) { }

  ngOnInit(): void {
    this.mostrar_tramites()
  }
  mostrar_tramites() {
    this.externoService.getExternos().subscribe(data => {
      this.data = data.tramites
      this.resultsLength = data.total
    })
  }

  agregar_tramite() {
    const dialogRef = this.dialog.open(DialogExternoComponent, {
      width: '1000px'
    });
    dialogRef.afterClosed().subscribe((result: ExternoData) => {
      if (result) {
        this.resultsLength += 1
        if (this.data.length === this.externoService.limit) {
          this.data.pop()
        }
        this.data = [result, ...this.data]
        this.remitir_tramite(result)
      }
    });
  }
  editar_tramite(tramite: ExternoData) {
    const dialogRef = this.dialog.open(DialogExternoComponent, {
      width: '1000px',
      data: tramite
    });
    dialogRef.afterClosed().subscribe((result: ExternoData) => {
      if (result) {
        const indexFound = this.data.findIndex(tramite => tramite._id === result._id)
        this.data[indexFound] = result
        this.data = [...this.data]
      }
    });
  }

  generar_ficha(tramite: ExternoData) {
    crear_ficha_tramite(tramite.tipo_tramite.nombre, tramite.fecha_registro, tramite.alterno, tramite.pin, tramite.solicitante.nombre, tramite.solicitante.dni, tramite.solicitante.documento, tramite.solicitante.tipo)
  }
  generar_hoja_ruta(id_tramite: string) {
    this.externoService.getExterno(id_tramite).subscribe(data => {
      crear_hoja_ruta(data.tramite, data.workflow, 'tramites_externos')
    })
  }
  remitir_tramite(tramite: ExternoData) {
    const dialogRef = this.dialog.open(DialogRemisionComponent, {
      width: '700px',
      data: {
        id_tramite: tramite._id,
        tipo: 'tramites_externos',
        tipo_tramite: tramite.tipo_tramite.nombre,
        alterno: tramite.alterno,
        cantidad: tramite.cantidad
      }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.mostrar_tramites()
      }
    });
  }
  paginacion(page: PageEvent) {
    this.externoService.offset = page.pageIndex
    this.externoService.limit = page.pageSize
    this.mostrar_tramites()
  }

}

