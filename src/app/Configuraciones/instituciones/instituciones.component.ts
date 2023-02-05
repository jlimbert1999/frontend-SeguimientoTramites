import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatLegacyDialog as MatDialog } from '@angular/material/legacy-dialog';
import { LegacyPageEvent as PageEvent } from '@angular/material/legacy-paginator';
import { InstitucionModel } from '../models/institucion.model';
import { InstitucionesService } from '../services/instituciones.service';
import { PaginationService } from '../services/pagination.service';
import { InstitucionDialogComponent } from './institucion-dialog/institucion-dialog.component';

@Component({
  selector: 'app-instituciones',
  templateUrl: './instituciones.component.html',
  styleUrls: ['./instituciones.component.css']
})
export class InstitucionesComponent implements OnInit {
  Instituciones: InstitucionModel[] = []

  displayedColumns = [
    { key: 'sigla', titulo: 'Sigla' },
    { key: 'nombre', titulo: 'Nombre' },
    { key: 'activo', titulo: 'Situacion' }
  ]
  @ViewChild("txtSearch") private searchInput: ElementRef;

  constructor(
    public dialog: MatDialog,
    public institucionesService: InstitucionesService,
    public paginationService: PaginationService
  ) { }

  ngOnInit(): void {
    this.paginationService.pageIndex = 0
    this.obtener_instituciones()

  }

  agregar_instituciones() {
    const dialogRef = this.dialog.open(InstitucionDialogComponent, {
      width: '700px'
    });
    dialogRef.afterClosed().subscribe((result: InstitucionModel) => {
      if (result) {
        this.Instituciones = [result, ...this.Instituciones]
      }
    });
  }
  editar_institucion(data: any) {
    const dialogRef = this.dialog.open(InstitucionDialogComponent, {
      width: '700px',
      data
    });
    dialogRef.afterClosed().subscribe((result: InstitucionModel) => {
      if (result) {
        let newData = [...this.Instituciones]
        const foundIndex = newData.findIndex(int => int.id_institucion === data.id_institucion);
        newData[foundIndex] = result;
        this.Instituciones = newData
      }
    });
  }
  cambiar_situacion(data: any) {
    this.institucionesService.cambiar_situacion_institucion(data.id_institucion!, data.activo).subscribe(inst => {
      let newData = [...this.Instituciones]
      const foundIndex = newData.findIndex(int => int.id_institucion === data.id_institucion);
      newData[foundIndex].activo = inst.activo;
      this.Instituciones = newData
    })
  }

  obtener_instituciones() {
    this.institucionesService.obtener_instituciones().subscribe(inst => {
      this.Instituciones = inst
    })
  }
  buscar_institucion() {
    if (this.institucionesService.termino_busqueda !== '') {
      this.institucionesService.buscar_instituciones(this.institucionesService.termino_busqueda.trim().toLowerCase()).subscribe(data => {
        this.Instituciones = data
      })
    }

  }
  cambiar_paginacion(evento: PageEvent) {
    if (this.institucionesService.termino_busqueda !== "") {
      this.buscar_institucion()
    }
    else {
      this.obtener_instituciones()
    }

  }

  activar_busqueda() {
    this.institucionesService.modo_busqueda(true)
    setTimeout(() => {
      this.searchInput.nativeElement.focus()
    })
  }
  desactivar_busqueda() {
    this.institucionesService.modo_busqueda(false)
    this.obtener_instituciones()
  }

}
