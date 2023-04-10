import { Component, OnInit } from '@angular/core';
import { UntypedFormControl } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { ReplaySubject, Subject, takeUntil } from 'rxjs';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { Cuenta } from '../../models/cuenta.interface';
import { Funcionario } from '../../models/funcionario.interface';
import { CuentaService } from '../../services/cuenta.service';
import { CreacionAsignacionComponent } from '../../dialogs/creacion-asignacion/creacion-asignacion.component';
import { CuentaDialogComponent } from '../../dialogs/cuenta-dialog/cuenta-dialog.component';
import { EdicionCuentaComponent } from '../../dialogs/edicion-cuenta/edicion-cuenta.component';
import { UsuarioDialogComponent } from './usuario-dialog/usuario-dialog.component';


@Component({
  selector: 'app-cuentas',
  templateUrl: './cuentas.component.html',
  styleUrls: ['./cuentas.component.css'],
  animations: [
    fadeInOnEnterAnimation(),
  ]
})
export class CuentasComponent implements OnInit {
  Cuentas: Cuenta[] = []
  displayedColumns = ['login', 'nombre', 'dependencia', 'institucion', 'activo', 'opciones']

  public bankCtrl: UntypedFormControl = new UntypedFormControl();
  public bankFilterCtrl: UntypedFormControl = new UntypedFormControl();
  public filteredBanks: ReplaySubject<any[]> = new ReplaySubject<any[]>(1);
  protected _onDestroy = new Subject<void>();

  instituciones: any[] = []
  dependencias: any[] = []
  text: string = ""



  id_institucion: string
  id_dependencia: string

  constructor(
    public dialog: MatDialog,
    public accountService: CuentaService,
    public paginatorService: PaginatorService,
  ) {
    this.accountService.getInstituciones().subscribe(data => {
      this.instituciones = data
    })
  }

  ngOnInit(): void {
    this.Get()
  }

  ngAfterViewInit() {
  }

  Get() {
    if (this.text !== '' || this.id_institucion) {
      this.accountService.search(
        this.paginatorService.limit,
        this.paginatorService.offset,
        this.text,
        this.id_institucion,
        this.id_dependencia).subscribe(data => {
          this.paginatorService.length = data.length
          this.Cuentas = data.cuentas
        })
    }
    else {
      this.accountService.get(this.paginatorService.limit, this.paginatorService.offset).subscribe(data => {
        this.paginatorService.length = data.length
        this.Cuentas = data.cuentas
      })

    }

  }

  Add() {
    const dialogRef = this.dialog.open(CuentaDialogComponent, {
      width: '1200px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.paginatorService.limit === this.Cuentas.length) {
          this.Cuentas.pop()
        }
        this.Cuentas = [...result, this.Cuentas]
      }
    });
  }
  Edit(cuenta: Cuenta) {
    const dialogRef = this.dialog.open(EdicionCuentaComponent, {
      width: '1600px',
      data: cuenta
    });
    dialogRef.afterClosed().subscribe((result: Cuenta) => {
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
    dialogRef.afterClosed().subscribe((result: Cuenta) => {
      if (result) {
        console.log(result)
        if (this.paginatorService.limit === this.Cuentas.length) {
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
  EditUser(account: Cuenta) {
    const dialogRef = this.dialog.open(UsuarioDialogComponent, {
      data: account.funcionario
    });
    dialogRef.afterClosed().subscribe((result: Funcionario) => {
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




  getDependencias(id_institucion: string) {
    this.paginatorService.offset = 0
    this.bankCtrl.setValue(null)
    this.filteredBanks.next([])
    if (this.id_institucion) {
      this.accountService.getDependencias(id_institucion).subscribe(deps => {
        this.dependencias = deps
        this.filteredBanks.next(this.dependencias.slice());
        this.bankFilterCtrl.valueChanges
          .pipe(takeUntil(this._onDestroy))
          .subscribe(() => {
            this.filterBanks();
          });
      })
    }
    this.Get()
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
    this.text = (event.target as HTMLInputElement).value;
    this.Get()
  }
  applyFilterbySelect() {
    this.paginatorService.offset = 0
    this.id_dependencia = this.bankCtrl.value
    this.Get()
  }

  applyFilter(event: Event) {
    this.paginatorService.offset = 0
    this.text = (event.target as HTMLInputElement).value;
    this.Get()
  }
  cancelSearch() {
    this.paginatorService.offset = 0
    this.text = ''
    this.Get()
  }


}
