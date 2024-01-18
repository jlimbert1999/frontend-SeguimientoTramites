import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TypeProcedureService } from '../../services/type-procedure.service';

import { typeProcedure } from '../../interfaces';
import { TypeProcedureDialogComponent } from '../../dialogs/type-procedure-dialog/type-procedure-dialog.component';
import { PaginatorService } from 'src/app/shared/services';

@Component({
  selector: 'app-tipos-tramites',
  templateUrl: './tipos-tramites.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TiposTramitesComponent implements OnInit {
  dataSource = signal<typeProcedure[]>([]);
  displayedColumns = ['nombre', 'segmento', 'activo', 'menu'];
  term: string = '';

  constructor(
    private dialog: MatDialog,
    private typeService: TypeProcedureService,
    private paginatorService: PaginatorService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    const subscription =
      this.term !== ''
        ? this.typeService.search({ ...this.paginatorService.PaginationParams, term: this.term })
        : this.typeService.findAll(this.paginatorService.PaginationParams);
    subscription.subscribe((data) => {
      this.dataSource.set(data.types);
      this.paginatorService.length = data.length;
    });
  }

  add() {
    const dialogRef = this.dialog.open(TypeProcedureDialogComponent, {
      width: '1200px',
    });
    dialogRef.afterClosed().subscribe((result: typeProcedure) => {
      if (!result) return;
      this.dataSource.update((values) => [result, ...values]);
      this.paginatorService.length++;
    });
  }
  edit(tipoTramite: typeProcedure) {
    const dialogRef = this.dialog.open(TypeProcedureDialogComponent, {
      width: '1200px',
      data: tipoTramite,
    });
    dialogRef.afterClosed().subscribe((result: typeProcedure) => {
      if (!result) return;
      this.dataSource.update((values) => {
        const index = values.findIndex((value) => value._id === result._id);
        values[index] = result;
        return [...values];
      });
    });
  }

  toggleStatus(typeProcedure: typeProcedure) {
    this.typeService.delete(typeProcedure._id).subscribe(({ activo }) => {
      this.dataSource.update((values) => {
        const index = values.findIndex((value) => value._id === typeProcedure._id);
        values[index].activo = activo;
        return [...values];
      });
    });
  }

  applyFilter(event: Event) {
    this.paginatorService.offset = 0;
    this.term = (event.target as HTMLInputElement).value;
    this.getData();
  }
  cancelSearch() {
    this.paginatorService.offset = 0;
    this.term = '';
    this.getData();
  }
}
