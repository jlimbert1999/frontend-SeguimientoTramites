import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { TramiteService } from '../services/tramite.service';
import { DialogExternoComponent } from './dialog-externo/dialog-externo.component';
import { crear_ficha_tramite } from 'src/app/generacion_pdfs/tramites';
import { DialogRemisionComponent } from '../dialog-remision/dialog-remision.component';
import { AuthService } from 'src/app/auth/services/auth.service';
import { ExternoModel_View } from '../models/tramite_externo.model';
@Component({
  selector: 'app-externos',
  templateUrl: './externos.component.html',
  styleUrls: ['./externos.component.css']
})
export class ExternosComponent implements OnInit, AfterViewInit {
  displayedColumns: string[] = ['ubicacion', 'alterno', 'tramite', 'descripcion', 'estado', 'solicitante', 'fecha_registro', 'opciones'];
  dataSource: ExternoModel_View[] = [];
  @ViewChild(MatPaginator) paginator: MatPaginator;
  resultsLength = 0;
  isLoadingResults = true;
  isRateLimitReached = false;
  encargado_actual = this.authService.Detalles_Cuenta


  constructor(
    public dialog: MatDialog,
    private toastr: ToastrService,
    private tramiteService: TramiteService,
    public authService: AuthService

  ) { }
  ngAfterViewInit(): void {

  }

  ngOnInit(): void {
    this.mostrar_tramites()
  }

  agregar_tramite() {
    const dialogRef = this.dialog.open(DialogExternoComponent, {
      width: '1000px'
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.mostrar_tramites()
        this.toastr.success(undefined, 'Tramite registrado', {
          positionClass: 'toast-bottom-right',
          timeOut: 3000
        })
      }
    });
  }
  editar_tramite(tramite: any) {
    const dialogRef = this.dialog.open(DialogExternoComponent, {
      width: '1000px',
      data: tramite
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.mostrar_tramites()
      }
    });
  }
  mostrar_tramites() {
    this.isLoadingResults = true
    this.tramiteService.obtener_tramites_externos(1, 2).subscribe(tramites => {
      this.isLoadingResults = false
      this.dataSource = tramites.tramites
      console.log(tramites)
    })
  }
  crear_ficha_tramite(tramite: any) {
    crear_ficha_tramite(tramite.tipo_tramite.nombre, tramite.fecha_registro, tramite.alterno, tramite.pin, tramite.solicitante.nombre, tramite.solicitante.dni, tramite.solicitante.documento, tramite.solicitante.tipo)
  }
  remitir_tramite(tramite: ExternoModel_View) {
    const dialogRef = this.dialog.open(DialogRemisionComponent, {
      width: '1000px',
      data: {
        envio: {
          _id: tramite._id,
          tipo: 'tramites_externos',
          estado: tramite.estado,
          tipo_tramite: tramite.tipo_tramite.nombre,
          alterno: tramite.alterno
        },
        reenvio: null
      }
    });
    dialogRef.afterClosed().subscribe((result: any) => {
      if (result) {
        this.mostrar_tramites()
      }
    });
  }

}

