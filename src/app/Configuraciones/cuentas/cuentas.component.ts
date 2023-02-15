import { DataSource } from '@angular/cdk/collections';
import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { FormControl, UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSelect } from '@angular/material/select';
import { MatTableDataSource } from '@angular/material/table';
import { collapseOnLeaveAnimation, expandOnEnterAnimation, fadeInOnEnterAnimation } from 'angular-animations';
import { map, Observable, ReplaySubject, Subject, takeUntil } from 'rxjs';
import Swal from 'sweetalert2';
import { CuentaModel, CuentaData } from '../models/cuenta.model';
import { UsuarioModel } from '../models/usuario.model';
import { CuentaService } from '../services/cuenta.service';
import { CreacionAsignacionComponent } from './creacion-asignacion/creacion-asignacion.component';
import { CuentaDialogComponent } from './cuenta-dialog/cuenta-dialog.component';
import { EdicionCuentaComponent } from './edicion-cuenta/edicion-cuenta.component';
import { UsuarioDialogComponent } from './usuario-dialog/usuario-dialog.component';




@Component({
  selector: 'app-cuentas',
  templateUrl: './cuentas.component.html',
  styleUrls: ['./cuentas.component.css'],
  animations: [
    fadeInOnEnterAnimation({ duration: 500 }),
    expandOnEnterAnimation(),
    collapseOnLeaveAnimation(),
  ]
})
export class CuentasComponent implements OnInit {
  Cuentas: CuentaData[] = []
  Total: number = 0
  displayedColumns = ['login', 'rol', 'nombre', 'dependencia', 'institucion', 'activo', 'opciones']

  searchOpions = [
    { value: 'funcionario', viewValue: 'FUNCIONARIO' },
    { value: 'dependencia', viewValue: 'DEPENDENCIA' },
  ]

  public bankCtrl: UntypedFormControl = new UntypedFormControl();
  public bankFilterCtrl: UntypedFormControl = new UntypedFormControl();
  public filteredBanks: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroy = new Subject<void>();

  // Options for search
  typeSearch: string = ""
  text: string = ""
  search_mode: boolean = false
  dependencias: any[] = []
  instituciones: any[] = []


  @ViewChild(MatPaginator) paginator: MatPaginator;

  constructor(public dialog: MatDialog, public accountService: CuentaService) { }

  ngOnInit(): void {


  }
  ngAfterViewInit() {
    this.Get()
  }
  Get() {
    this.accountService.Get(this.paginator.pageSize, this.paginator.pageIndex).subscribe(data => {
      this.Total = data.total
      this.Cuentas = data.cuentas
    })
  }

  Add() {
    const dialogRef = this.dialog.open(CuentaDialogComponent, {
      width: '1200px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.Total += 1
        if (this.Cuentas.length === this.paginator.pageSize) {
          this.Cuentas.pop()
        }
        this.Cuentas = [result, ...this.Cuentas]
      }
    });
  }
  Edit(data: CuentaData) {
    const dialogRef = this.dialog.open(EdicionCuentaComponent, {
      width: '1200px',
      data: data
    });
    dialogRef.afterClosed().subscribe((result: CuentaData) => {
      if (result) {
        const indexFound = this.Cuentas.findIndex(cuenta => cuenta._id === result._id)
        this.Cuentas[indexFound] = result
        this.Cuentas = [...this.Cuentas]
      }
    });
  }
  AddAccountLink() {
    const dialogRef = this.dialog.open(CreacionAsignacionComponent, {
      width: '1200px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        this.Total += 1
        if (this.Cuentas.length === this.paginator.pageSize) {
          this.Cuentas.pop()
        }
        this.Cuentas = [result, ...this.Cuentas]
      }
    });
  }


  AddUser() {
    this.dialog.open(UsuarioDialogComponent, {
      width: '900px'
    });
  }
  EditUser(account: CuentaData) {
    const dialogRef = this.dialog.open(UsuarioDialogComponent, {
      data: account.funcionario
    });
    dialogRef.afterClosed().subscribe((result: UsuarioModel) => {
      if (result) {
        let indexFound = this.Cuentas.findIndex(account => account._id === result._id)
        this.Cuentas[indexFound] = Object.assign(account, { funcionario: result })
      }
    });
  }



  disable(id_cuenta: string) {
    this.accountService.delete(id_cuenta).subscribe(activo => {
      const indexFound = this.Cuentas.findIndex(element => element._id === id_cuenta)
      this.Cuentas[indexFound].activo = activo
      this.Cuentas = [...this.Cuentas]
    })
  }

  changeSearchMode(option: boolean) {
    this.search_mode = option
    if (!option) {
      this.typeSearch = ""
      this.paginator.firstPage()
      this.Get()
    }
  }


  selectTypeSearch(option: string) {
    this.typeSearch = option
    this.instituciones = []
    this.filteredBanks.next([])
    this.text = ""
    if (this.typeSearch === 'dependencia') {
      this.accountService.getInstituciones().subscribe(inst => {
        this.instituciones = inst
      })
    }
  }

  getDependencias(id_institucion: string) {
    this.dependencias = []
    this.accountService.getDependencias(id_institucion).subscribe(deps => {
      this.dependencias = deps
      this.bankCtrl.setValue(this.dependencias);
      this.filteredBanks.next(this.dependencias.slice());
      this.bankFilterCtrl.valueChanges
        .pipe(takeUntil(this._onDestroy))
        .subscribe(() => {
          this.filterBanks();
        });
    })
  }

  protected filterBanks() {
    if (!this.dependencias) {
      return;
    }
    let search = this.bankFilterCtrl.value;
    if (!search) {
      this.filteredBanks.next(this.dependencias.slice());
      return;
    } else {
      search = search.toLowerCase();
    }
    this.filteredBanks.next(
      this.dependencias.filter(bank => bank.nombre.toLowerCase().indexOf(search) > -1)
    );
  }



  applyFilterbyText(event: Event) {
    this.paginator.firstPage()
    this.text = (event.target as HTMLInputElement).value;
    this.search()
  }
  applyFilterbySelect() {
    this.paginator.firstPage()
    this.text = this.bankCtrl.value
    this.search()
  }
  search() {
    if (this.typeSearch !== '' && this.text !== '') {
      this.accountService.search(this.typeSearch, this.text, this.paginator.pageSize, this.paginator.pageIndex).subscribe(data => {
        this.Cuentas = data.cuentas
        this.Total = data.total
      })
    }
  }

  onPaginationChange() {
    if (this.search_mode) {
      this.search()
    }
    else {
      this.Get()
    }
  }











}
