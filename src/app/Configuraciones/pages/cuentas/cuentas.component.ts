import { Component, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { Cuenta } from '../../models/cuenta.interface';
import { Funcionario } from '../../models/funcionario.interface';
import { CuentaService } from '../../services/cuenta.service';
import { CreacionAsignacionComponent } from '../../dialogs/creacion-asignacion/creacion-asignacion.component';
import { CuentaDialogComponent } from '../../dialogs/cuenta-dialog/cuenta-dialog.component';
import { EdicionCuentaComponent } from '../../dialogs/edicion-cuenta/edicion-cuenta.component';
import { UsuarioDialogComponent } from './officer-dialog/usuario-dialog.component';
import { institution } from '../../interfaces/institution.interface';
import { dependency } from '../../interfaces/dependency.interface';
import { account } from '../../interfaces/account.interface';
import { MatInput } from '@angular/material/input';


@Component({
  selector: 'app-cuentas',
  templateUrl: './cuentas.component.html',
  styleUrls: ['./cuentas.component.scss'],
  animations: [
    fadeInOnEnterAnimation(),
  ]
})
export class CuentasComponent implements OnInit {
  accounts: account[] = []
  displayedColumns = ['login', 'nombre', 'dependencia', 'institucion', 'activo', 'opciones']
  institutions: institution[] = []
  dependencies: dependency[] = []
  text: string = ""
  id_institucion: string | null
  id_dependencia: string | null
  @ViewChild('myInput') myInput: MatInput;

  constructor(
    public dialog: MatDialog,
    public accountService: CuentaService,
    public paginatorService: PaginatorService,
  ) {
    this.accountService.getInstitutions().subscribe(data => {
      this.institutions = data
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
          this.accounts = data.accounts
        })
    }
    else {
      this.accountService.get(this.paginatorService.limit, this.paginatorService.offset).subscribe(data => {
        this.paginatorService.length = data.length
        this.accounts = data.accounts
      })

    }

  }

  Add() {
    const dialogRef = this.dialog.open(CuentaDialogComponent, {
      width: '1200px'
    });
    dialogRef.afterClosed().subscribe(result => {
      if (result) {
        if (this.paginatorService.limit === this.accounts.length) {
          this.accounts.pop()
        }
        this.accounts = [...result, this.accounts]
      }
    });
  }
  Edit(cuenta: Cuenta) {
    const dialogRef = this.dialog.open(EdicionCuentaComponent, {
      width: '1600px',
      data: cuenta
    });
    dialogRef.afterClosed().subscribe((result: account) => {
      if (result) {
        const indexFound = this.accounts.findIndex(cuenta => cuenta._id === result._id)
        this.accounts[indexFound] = result
        this.accounts = [...this.accounts]
      }
    });
  }
  AddAccountLink() {
    const dialogRef = this.dialog.open(CreacionAsignacionComponent, {
      width: '1200px'
    });
    dialogRef.afterClosed().subscribe((result: account) => {
      if (result) {
        if (this.paginatorService.limit === this.accounts.length) {
          this.accounts.pop()
        }
        this.accounts = [result, ...this.accounts]
      }
    });
  }


  AddUser() {
    this.dialog.open(UsuarioDialogComponent, {
      width: '900px'
    });
  }
  EditUser(account: Cuenta) {
    // const dialogRef = this.dialog.open(UsuarioDialogComponent, {
    //   data: account.funcionario
    // });
    // dialogRef.afterClosed().subscribe((result: Funcionario) => {
    //   if (result) {
    //     let indexFound = this.Cuentas.findIndex(account => account._id === result._id)
    //     this.Cuentas[indexFound] = Object.assign(account, { funcionario: result })
    //   }
    // });
  }

  disable(id_cuenta: string) {
    // this.accountService.delete(id_cuenta).subscribe(activo => {
    //   const indexFound = this.Cuentas.findIndex(element => element._id === id_cuenta)
    //   this.Cuentas[indexFound].activo = activo
    //   this.Cuentas = [...this.Cuentas]
    // })
  }




  getDependencias(institution: institution | null) {
    if (institution) {
      this.id_institucion = institution._id
      this.accountService.getDependencies(institution._id).subscribe(data => {
        this.dependencies = data
      })
    }
    else {
      this.id_institucion = null
      this.id_dependencia = null
      this.dependencies = []
    }
    this.paginatorService.offset = 0
    this.Get()
  }
  getAccountsOfDependency(dependency: dependency | null) {
    if (dependency) {
      this.id_dependencia = dependency._id
    }
    else {
      this.id_dependencia = null
    }
    this.Get()
  }

  applyFilter(event: Event) {
    console.log(this.myInput);
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
