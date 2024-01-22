import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { CuentaService } from '../../services/cuenta.service';
import { CreacionAsignacionComponent } from '../../dialogs/creacion-asignacion/creacion-asignacion.component';
import { CuentaDialogComponent } from '../../dialogs/cuenta-dialog/cuenta-dialog.component';
import { EditAccountDialogComponent } from '../../dialogs/edit-account-dialog/edit-account-dialog.component';
import { PaginatorService } from 'src/app/shared/services';
import { MatSelectSearchData } from 'src/app/shared/interfaces';
import { Account } from '../../models/account.model';

@Component({
  selector: 'app-accounts',
  templateUrl: './accounts.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class AccountsComponent implements OnInit {
  displayedColumns = ['visibility', 'login', 'nombre', 'dependency', 'activo', 'options'];
  accounts = signal<Account[]>([]);
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
    const subscription =
      this.text !== ''
        ? this.accountService.search({
            id_dependency: this.id_dependencia,
            text: this.text,
            ...this.paginatorService.PaginationParams,
          })
        : this.accountService.findAll({
            id_dependency: this.id_dependencia,
            ...this.paginatorService.PaginationParams,
          });
    subscription.subscribe((data) => {
      this.accounts.set(data.accounts);
      this.paginatorService.length = data.length;
    });
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

  add() {
    const dialogRef = this.dialog.open(CuentaDialogComponent, {
      width: '1000px',
    });
    dialogRef.afterClosed().subscribe((result: Account) => {
      if (!result) return;
      this.accounts.update((values) => [result, ...values]);
      this.paginatorService.length++;
    });
  }

  edit(accont: Account) {
    const dialogRef = this.dialog.open(EditAccountDialogComponent, {
      width: '1200px',
      data: accont,
    });
    dialogRef.afterClosed().subscribe((result?: Account) => {
      if (!result) return;
      this.accounts.update((values) => {
        const index = values.findIndex((value) => value._id === result._id);
        values[index] = result;
        return [...values];
      });
    });
  }
  assign() {
    const dialogRef = this.dialog.open(CreacionAsignacionComponent, {
      width: '1000px',
    });
    dialogRef.afterClosed().subscribe((result: Account) => {
      if (!result) return;
      this.accounts.update((values) => [result, ...values]);
      this.paginatorService.length++;
    });
  }

  cancelSearch() {
    this.paginatorService.offset = 0;
    this.text = '';
    this.getData();
  }

  toggleVisibility(account: Account) {
    this.accountService.toggleVisibility(account._id).subscribe((state) => {
      this.accounts.update((values) => {
        const index = values.findIndex((item) => item._id === account._id);
        values[index].isVisible = state;
        return [...values];
      });
    });
  }
  
  disable(account: Account) {
    this.accountService.disable(account._id).subscribe((activo) => {
      this.accounts.update((values) => {
        const index = values.findIndex((item) => item._id === account._id);
        values[index].activo = activo;
        return [...values];
      });
    });
  }
}
