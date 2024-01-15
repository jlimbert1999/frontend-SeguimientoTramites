import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CuentaService } from '../../services/cuenta.service';
import { CreacionAsignacionComponent } from '../../dialogs/creacion-asignacion/creacion-asignacion.component';
import { OfficerDialogComponent } from '../../dialogs/officer-dialog/officer-dialog.component';
import { CuentaDialogComponent } from '../../dialogs/cuenta-dialog/cuenta-dialog.component';
import { EditAccountDialogComponent } from '../../dialogs/edit-account-dialog/edit-account-dialog.component';
import { account } from '../../interfaces/account.interface';
import { PaginatorService } from 'src/app/shared/services';
import { MatSelectSearchData } from 'src/app/shared/interfaces';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  styleUrls: ['./accounts.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsComponent implements OnInit {
  accounts = signal<account[]>([]);
  displayedColumns = ['login', 'nombre', 'dependencia', 'activo', 'opciones'];
  institutions = signal<MatSelectSearchData<string>[]>([]);
  dependencies = signal<MatSelectSearchData<string>[]>([]);
  text: string = '';
  id_dependencia?: string;

  constructor(
    public dialog: MatDialog,
    public accountService: CuentaService,
    public paginatorService: PaginatorService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  searchInstitutions(term: string) {
    this.accountService.getInstitutions(term).subscribe((data) => {
      this.institutions.set(data.map((inst) => ({ text: inst.nombre, value: inst._id })));
    });
  }

  searchDependencies(id_institucion: string) {
    this.accountService.getDependenciesOfInstitution(id_institucion).subscribe((data) => {
      this.dependencies.set(data.map((dependency) => ({ value: dependency._id, text: dependency.nombre })));
    });
  }

  getData() {
    if (this.text !== '') {
      this.accountService
        .search({ id_dependency: this.id_dependencia, text: this.text, ...this.paginatorService.PaginationParams })
        .subscribe((data) => {
          this.paginatorService.length = data.length;
          this.accounts.set(data.accounts);
        });
    } else {
      this.accountService
        .get(this.paginatorService.limit, this.paginatorService.offset, this.id_dependencia)
        .subscribe((data) => {
          this.paginatorService.length = data.length;
          this.accounts.set(data.accounts);
        });
    }
  }

  appliFilterByText() {
    if (this.text === '') return;
    this.paginatorService.offset = 0;
    this.getData();
  }
  applyFilterByDependency(id_dependency?: string) {
    this.paginatorService.offset = 0;
    this.id_dependencia = id_dependency;
    this.getData();
  }

  Add() {
    const dialogRef = this.dialog.open(CuentaDialogComponent, {
      width: '1000px',
      disableClose: true,

    });
    dialogRef.afterClosed().subscribe((result: account) => {
      if (result) {
        // if (this.paginatorService.limit === this.accounts.length) {
        //   this.accounts.pop();
        // }
        // this.accounts = [result, ...this.accounts];
      }
    });
  }
  addAccountWithAssign() {
    const dialogRef = this.dialog.open(CreacionAsignacionComponent, {
      width: '1000px',
      disableClose: true,
    });
    dialogRef.afterClosed().subscribe((result: account) => {
      if (result) {
        // if (this.paginatorService.limit === this.accounts.length) {
        //   this.accounts.pop();
        // }
        // this.accounts = [result, ...this.accounts];
      }
    });
  }
  Edit(cuenta: account) {
    const dialogRef = this.dialog.open(EditAccountDialogComponent, {
      width: '1200px',
      disableClose: true,
      data: cuenta,
    });
    dialogRef.afterClosed().subscribe((result: account) => {
      if (result) {
        // const indexFound = this.accounts.findIndex((cuenta) => cuenta._id === result._id);
        // this.accounts[indexFound] = result;
        // this.accounts = [...this.accounts];
      }
    });
  }

  AddUser() {
    this.dialog.open(OfficerDialogComponent, {
      width: '900px',
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

  cancelSearch() {
    this.paginatorService.offset = 0;
    this.text = '';
    this.getData();
  }
}
