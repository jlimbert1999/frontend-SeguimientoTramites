import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { TiposTramitesModel } from '../models/tiposTramites.model';
import { TiposTramitesService } from '../services/tipos-tramites.service';
import { DialogTiposComponent } from './dialog-tipos/dialog-tipos.component';
import { ToastrService } from 'ngx-toastr';
import { PaginationService } from '../services/pagination.service';

@Component({
  selector: 'app-tipos-tramites',
  templateUrl: './tipos-tramites.component.html',
  styleUrls: ['./tipos-tramites.component.css'],
})
export class TiposTramitesComponent implements OnInit {
  TiposTramites: TiposTramitesModel[] = []
  displayedColumns = [
    { key: 'nombre', titulo: 'Nombre' },
    { key: 'segmento', titulo: 'Segmento' },
    { key: 'activo', titulo: 'Situacion' },
  ];
  @ViewChild("txtSearch") private searchInput: ElementRef;

  constructor(
    public dialog: MatDialog,
    public tiposTramitesService: TiposTramitesService,
    private toastr: ToastrService,
    private paginationService: PaginationService
  ) { }


  ngOnInit(): void {
    this.paginationService.pageIndex = 0
    this.obtener_tiposTramites()
  }

  agregar_tipoTramite() {
    const dialogRef = this.dialog.open(DialogTiposComponent, {
      width: '1000px'
    });
    dialogRef.afterClosed().subscribe((result: TiposTramitesModel) => {
      if (result) {
        let data = [result, ...this.TiposTramites]
        this.TiposTramites = data
      }
    });
  }
  editar_tipoTramite(tipoTramite: any) {
    const dialogRef = this.dialog.open(DialogTiposComponent, {
      width: '1000px',
      data: tipoTramite
    });
    dialogRef.afterClosed().subscribe((result: TiposTramitesModel) => {
      if (result) {
        this.obtener_tiposTramites()
      }
      
    });
  }
  cambiar_situacion_tipoTramite(tipoTramite: any) {
    let newSituacion: boolean
    if (tipoTramite.activo) {
      newSituacion = false
    }
    else {
      newSituacion = true
    }
    this.tiposTramitesService
      .cambiar_situacion_tipoTramite(tipoTramite.id_tipoTramite!, newSituacion)
      .subscribe((tipo) => {
        let data = [...this.TiposTramites]
        const indexFound = data.findIndex(element => element.id_tipoTramite === tipoTramite.id_tipoTramite)
        data[indexFound].activo = newSituacion
        this.TiposTramites = data
        this.toastr.success(undefined, 'Tipo de tramite actualizado', {
          positionClass: 'toast-bottom-right',
          timeOut: 3000
        })
      });
  }
  obtener_tiposTramites() {
    this.tiposTramitesService.obtener_tiposTramites().subscribe(tiposTramites => {
      this.TiposTramites = tiposTramites
    });
  }
  buscar_TipoTramites() {
    if (this.tiposTramitesService.termino_busqueda !== '') {
      this.tiposTramitesService.buscar_tipoTramite().subscribe(data => {
        this.TiposTramites = data
      })
    }

  }
  cambiar_paginacion(evento: PageEvent) {
    if (this.tiposTramitesService.termino_busqueda !== "") {
      this.buscar_TipoTramites()
    }
    else {
      this.obtener_tiposTramites()
    }

  }
  activar_busqueda() {
    this.tiposTramitesService.modo_busqueda(true)
    setTimeout(() => {
      this.searchInput.nativeElement.focus()
    })
  }
  desactivar_busqueda() {
    this.tiposTramitesService.modo_busqueda(false)
    this.obtener_tiposTramites()
  }
}
