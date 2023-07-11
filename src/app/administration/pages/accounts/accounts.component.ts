import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { CuentaService } from '../../services/cuenta.service';
import { CreacionAsignacionComponent } from '../../dialogs/creacion-asignacion/creacion-asignacion.component';
import { OfficerDialogComponent } from '../../dialogs/officer-dialog/officer-dialog.component';
import { CuentaDialogComponent } from '../../dialogs/cuenta-dialog/cuenta-dialog.component';
import { EdicionCuentaComponent } from '../../dialogs/edicion-cuenta/edicion-cuenta.component';
import { institution } from '../../interfaces/institution.interface';
import { dependency } from '../../interfaces/dependency.interface';
import { account } from '../../interfaces/account.interface';


@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
  animations: [
    fadeInOnEnterAnimation(),
  ]
})
export class AccountsComponent implements OnInit {
  accounts: account[] = []
  displayedColumns = ['login', 'nombre', 'dependencia', 'institucion', 'activo', 'opciones']
  institutions: institution[] = []
  dependencies: dependency[] = []
  text: string = ""
  id_institucion: string | null
  id_dependencia: string | null

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
      width: '900px'
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
  addAccountWithAssign() {
    const dialogRef = this.dialog.open(CreacionAsignacionComponent, {
      width: '900px'
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
  Edit(cuenta: account) {
    const dialogRef = this.dialog.open(EdicionCuentaComponent, {
      width: '1200px',
      disableClose: true,
      data: cuenta,
    });
    dialogRef.afterClosed().subscribe((result: account) => {
      if (result) {
        const indexFound = this.accounts.findIndex(cuenta => cuenta._id === result._id)
        this.accounts[indexFound] = result
        this.accounts = [...this.accounts]
      }
    });
  }



  AddUser() {
    this.dialog.open(OfficerDialogComponent, {
      width: '900px'
    });
  }
  EditUser(account: account) {
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
