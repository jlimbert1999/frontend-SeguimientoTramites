import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { DependenciaModel } from '../models/dependencia.model';
import { DependenciasService } from '../services/dependencias.service';
import { PaginationService } from '../services/pagination.service';
import { DependenciaDialogComponent } from './dependencia-dialog/dependencia-dialog.component';

@Component({
  selector: 'app-dependencias',
  templateUrl: './dependencias.component.html',
  styleUrls: ['./dependencias.component.css']
})
export class DependenciasComponent implements OnInit {
  Dependencias: DependenciaModel[] = []
  displayedColumns = [
    { key: 'sigla', titulo: 'Sigla' },
    { key: 'nombre', titulo: 'Nombre' },
    { key: 'codigo', titulo: 'Codigo' },
    { key: 'institucion', titulo: 'Institucion' },
    { key: 'activo', titulo: 'Situacion' },
   
  ]
  @ViewChild("txtSearch") private searchInput: ElementRef;
  constructor(public dialog: MatDialog, public dependenciasService: DependenciasService, public paginationService: PaginationService) { }

  ngOnInit(): void {
    this.paginationService.pageIndex = 0
    this.obtener_dependencias()
  }


  agregar_dependencia() {
    const dialogRef = this.dialog.open(DependenciaDialogComponent, {
      width: '700px'
    });
    dialogRef.afterClosed().subscribe((result: DependenciaModel) => {
      if (result) {
        this.Dependencias = [result, ...this.Dependencias]
      }
    });
  }
  editar_dependencia(data: any) {
    const dialogRef = this.dialog.open(DependenciaDialogComponent, {
      width: '700px',
      data
    });
    dialogRef.afterClosed().subscribe((result: DependenciaModel) => {
      if (result) {
        let newData = [...this.Dependencias]
        const indexFound = newData.findIndex(element => element.id_dependencia === data.id_dependencia)
        newData[indexFound] = result
        this.Dependencias = newData
      }
    });
  }
  obtener_dependencias() {
    this.dependenciasService.obtener_dependencias().subscribe(deps => {
      this.Dependencias = deps

    })

  }
  cambiar_situacion(data: any) {
    let newSituacion: boolean
    if (data.activo) {
      newSituacion = false
    }
    else {
      newSituacion = true
    }
    this.dependenciasService.cambiar_situacion_dependencia(data.id_dependencia, newSituacion).subscribe(message => {
      let newData = [...this.Dependencias]
      const indexFound = newData.findIndex(element => element.id_dependencia === data.id_dependencia)
      newData[indexFound].activo = newSituacion
      this.Dependencias = newData
    })
  }
  buscar_dependencia() {
    if (this.dependenciasService.termino_busqueda !== "") {
      this.dependenciasService.buscar_dependencia(this.dependenciasService.termino_busqueda.trim().toLowerCase()).subscribe(data => {
        this.Dependencias = data
      })
    }
  }


  activar_busqueda() {
    this.dependenciasService.modo_busqueda(true)
    setTimeout(() => {
      this.searchInput.nativeElement.focus()
    })
  }
  desactivar_busqueda() {
    this.dependenciasService.modo_busqueda(false)
    this.obtener_dependencias()
  }
  cambiar_paginacion(evento: any) {
    if (this.dependenciasService.termino_busqueda !== "") {
      this.buscar_dependencia()
    }
    else {
      this.obtener_dependencias()
    }

  }

}
