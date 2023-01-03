import { AfterViewInit, Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { ToastrService } from 'ngx-toastr';
import { TramiteService } from '../services/tramite.service';
import { DialogExternoComponent } from './dialog-externo/dialog-externo.component';
import { crear_ficha_tramite, crear_hoja_ruta } from 'src/app/Tramites/pdf/tramites';
import { DialogRemisionComponent } from '../dialog-remision/dialog-remision.component';
import { AuthService } from 'src/app/auth/services/auth.service';
import { MatBottomSheet } from '@angular/material/bottom-sheet';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { ExternosService } from '../services/externos.service';
import { catchError, map, of, startWith, switchMap } from 'rxjs';
import { Externo, ExternoData, Representante, Solicitante } from './models/externo';
import Swal from 'sweetalert2';
import { LocationComponent } from 'src/app/shared/location/location.component';

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

  showFilter: boolean = false
  filterOpions = [
    'ALTERNO',
    'SOLICITANTE',
    'TIPO DE TRAMITE'
  ]
  selectedTypeFilter: string


  constructor(
    public dialog: MatDialog,
    private toastr: ToastrService,
    public authService: AuthService,
    public externoService: ExternosService,
    private _bottomSheet: MatBottomSheet
  ) { }

  ngOnInit(): void {
    this.mostrar_tramites()
  }
  openBottomSheet(location: any): void {
    this._bottomSheet.open(LocationComponent, {
      data: location
    });
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
    dialogRef.afterClosed().subscribe((result: { tramite: Externo, solicitante: Solicitante, representante: Representante | null }) => {
      if (result) {
        this.showLoadingRequest()
        this.externoService.addExterno(result.tramite, result.solicitante, result.representante).subscribe(tramite => {
          this.resultsLength += 1
          this.data = [tramite, ...this.data]
          if (this.data.length === this.externoService.limit) {
            this.data.pop()
          }
          Swal.close();
          this.remitir_tramite(tramite)
        })
      }
    });
  }
  editar_tramite(tramite: ExternoData) {
    const dialogRef = this.dialog.open(DialogExternoComponent, {
      width: '1000px',
      data: tramite
    });
    dialogRef.afterClosed().subscribe((result: { tramite: any, solicitante: Solicitante, representante: Representante }) => {
      if (result) {
        this.showLoadingRequest()
        this.externoService.editExterno(tramite._id, result.tramite, result.solicitante, result.representante).subscribe(tramite => {
          const indexFound = this.data.findIndex(tramite => tramite._id === tramite._id)
          this.data[indexFound] = tramite
          this.data = [...this.data]
          Swal.close();
        })
      }
    });
  }

  generar_ficha(tramite: ExternoData) {
    crear_ficha_tramite(tramite.tipo_tramite.nombre, tramite.fecha_registro, tramite.alterno, tramite.pin, tramite.solicitante.nombre, tramite.solicitante.paterno, tramite.solicitante.materno, tramite.solicitante.dni, tramite.solicitante.documento, tramite.solicitante.tipo)
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

  denied_options(estado: string, responsable: string) {
    if (estado === 'CONCLUIDO' || responsable !== this.authService.Detalles_Cuenta.id_cuenta) {
      return true
    }
    return false
  }

  showLoadingRequest() {
    Swal.fire({
      title: 'Guardando....',
      text: 'Por favor espere',
      allowOutsideClick: false,
    });
    Swal.showLoading()
  }

  filter(event: Event, option: string) {
    // const filterValue = (event.target as HTMLInputElement).value;
    // if (filterValue !== '') {
    //   this.externoService.filter(filterValue, option).subscribe(tramites => {
    //     this.data = [...tramites]
    //   })
    // }

  }



}

