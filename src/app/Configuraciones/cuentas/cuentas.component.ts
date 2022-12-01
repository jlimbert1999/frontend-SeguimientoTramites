import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { PageEvent } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { map, Observable, ReplaySubject, startWith, Subject, takeUntil } from 'rxjs';
import { CuentaModel, CuentaModel_view } from '../models/cuenta.mode';
import { UsuarioModel } from '../models/usuario.model';
import { CuentaService } from '../services/cuenta.service';
import { AsignacionDialogComponent } from './asignacion-dialog/asignacion-dialog.component';
import { CreacionAsignacionComponent } from './creacion-asignacion/creacion-asignacion.component';
import { CuentaDialogComponent } from './cuenta-dialog/cuenta-dialog.component';
import { UsuarioDialogComponent } from './usuario-dialog/usuario-dialog.component';




@Component({
  selector: 'app-cuentas',
  templateUrl: './cuentas.component.html',
  styleUrls: ['./cuentas.component.css'],
  animations: [
    fadeInOnEnterAnimation({ duration: 500 })
  ]
})
export class CuentasComponent implements OnInit {
  Cuentas: CuentaModel_view[] = []
  Total: number = 0
  dataSource = new MatTableDataSource<CuentaModel_view>()
  displayedColumns = ['login', 'nombre', 'cargo', 'dependencia', 'institucion', 'rol', 'opciones']
  isLoadingResults = true;

  //opciones para filtrar
  Dependencias: any[]
  Instituciones: any[]
  modo_filtro: boolean = false
  @ViewChild("txtSearch") private searchInput: ElementRef;
  constructor(public dialog: MatDialog, public cuentaService: CuentaService) { }

  ngOnInit(): void {
    this.obtener_cuentas()
  }
  agregar_cuenta() {
    const dialogRef = this.dialog.open(CuentaDialogComponent, {
      width: '800px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.Cuentas.unshift(result)
        if (this.Cuentas.length > this.cuentaService.rows) {
          this.Cuentas.pop()
        }
        this.dataSource.data = this.Cuentas
      }
    });
  }
  agregar_cuenta_asignar() {
    const dialogRef = this.dialog.open(CreacionAsignacionComponent, {
      width: '900px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.obtener_cuentas()
      }
    });

  }
  editar_cuenta(data: CuentaModel_view) {
    const dialogRef = this.dialog.open(CuentaDialogComponent, {
      width: '1000px',
      data: data
    });
    dialogRef.afterClosed().subscribe((result: CuentaModel) => {
      if (result) {
        this.obtener_cuentas()
      }
    });
  }

  agregar_funcionario() {
    const dialogRef = this.dialog.open(UsuarioDialogComponent, {
      width: '600px'
    });

  }
  editar_funcionario(user: CuentaModel_view) {
    const dialogRef = this.dialog.open(UsuarioDialogComponent, {
      data: user.funcionario
    });
    dialogRef.afterClosed().subscribe((result: UsuarioModel) => {
      if (result) {
        const indexFound = this.Cuentas.findIndex(element => element.funcionario._id === result._id)
        this.Cuentas[indexFound].funcionario = result
        this.dataSource.data = this.Cuentas
      }
    });
  }
  asignar_cuenta(cuenta: CuentaModel_view) {
    const dialogRef = this.dialog.open(AsignacionDialogComponent, {
      width: '900px',
      data: cuenta
    });
    dialogRef.afterClosed().subscribe((result: CuentaModel_view) => {
      if (result) {
        this.obtener_cuentas()
      }
    });
  }
  buscar() {
    if (this.cuentaService.termino_busqueda !== '') {
      this.cuentaService.buscar_cuenta().subscribe(cuentas => {

        this.Cuentas = cuentas
        this.dataSource.data = this.Cuentas
      })
    }

  }


  obtener_cuentas() {
    this.cuentaService.obtener_cuentas().subscribe(cuentas => {
      this.Cuentas = cuentas
      this.dataSource.data = this.Cuentas
      this.isLoadingResults = false
    })
  }


  cambiar_paginacion(event: PageEvent) {
    this.cuentaService.page = event.pageIndex
    this.cuentaService.rows = event.pageSize
    this.obtener_cuentas()
  }

  activar_busqueda() {
    this.cuentaService.modo_busqueda(true)
    setTimeout(() => {
      this.searchInput.nativeElement.focus()
    })
  }
  desactivar_busqueda() {
    this.cuentaService.modo_busqueda(false)
    this.obtener_cuentas()
  }

  modo_filtrado(activo: boolean) {
    this.modo_filtro = activo
    if (activo) {
      this.cuentaService.obtener_instituciones_hablitadas().subscribe(inst => this.Instituciones = inst)
    }
    else {
      this.obtener_cuentas()
    }
  }



  filtrar() {


  }









}
