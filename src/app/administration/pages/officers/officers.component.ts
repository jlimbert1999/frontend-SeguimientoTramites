import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { UsuariosService } from '../../services/usuarios.service';
import { officer } from '../../interfaces/oficer.interface';
import { WorkHistoryComponent } from '../../dialogs/work-history/work-history.component';
import { OfficerDialogComponent } from '../../dialogs/officer-dialog/officer-dialog.component';
import { PaginatorService } from 'src/app/shared/services';
import { Officer } from '../../models/officer.model';

@Component({
  selector: 'app-officers',
  templateUrl: './officers.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class OfficersComponent implements OnInit {
  dataSource = signal<Officer[]>([]);
  displayedColumns = ['nombre', 'dni', 'cargo', 'telefono', 'activo', 'opciones'];
  text: string = '';
  constructor(
    private funcionariosService: UsuariosService,
    private paginatorService: PaginatorService,
    public dialog: MatDialog
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    const subscription =
      this.text !== ''
        ? this.funcionariosService.search({ ...this.paginatorService.PaginationParams, text: this.text })
        : this.funcionariosService.findAll(this.paginatorService.PaginationParams);
    subscription.subscribe((data) => {
      this.dataSource.set(data.officers);
      this.paginatorService.length = data.length;
    });
  }

  add() {
    const dialogRef = this.dialog.open(OfficerDialogComponent, {
      width: '800px',
    });
    dialogRef.afterClosed().subscribe((result: Officer) => {
      if (!result) return;
      this.dataSource.update((values) => [result, ...values]);
      this.paginatorService.length++;
    });
  }

  edit(officer: Officer) {
    const dialogRef = this.dialog.open<OfficerDialogComponent, any, Officer | undefined>(OfficerDialogComponent, {
      width: '800px',
      data: officer,
    });
    dialogRef.afterClosed().subscribe((result) => {
      if (!result) return;
      this.dataSource.update((values) => {
        const index = values.findIndex((value) => value._id === result._id);
        values[index] = result;
        return [...values];
      });
    });
  }

  delete(officer: officer) {
    this.funcionariosService.delete(officer._id).subscribe(({ activo }) => {
      this.dataSource.update((values) => {
        const index = values.findIndex((value) => value._id === officer._id);
        values[index].activo = activo;
        return [...values];
      });
    });
  }
  viewWorkHistory(officer: officer) {
    this.dialog.open(WorkHistoryComponent, { width: '1000px', data: officer });
  }
  applyFilter() {
    if (this.text === '') return;
    this.paginatorService.offset = 0;
    this.getData();
  }
  cancelSearch() {
    this.paginatorService.offset = 0;
    this.text = '';
    this.getData();
  }
}
