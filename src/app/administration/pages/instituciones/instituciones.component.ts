import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InstitucionesService } from '../../services/instituciones.service';
import { InstitutionDialogComponent } from '../../dialogs/institution-dialog/institution-dialog.component';
import { institution } from '../../interfaces/institution.interface';
import { PaginatorService } from 'src/app/shared/services';

@Component({
  selector: 'app-instituciones',
  templateUrl: './instituciones.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstitucionesComponent implements OnInit {
  displayedColumns: string[] = ['sigla', 'nombre', 'situacion', 'menu'];
  dataSource = signal<institution[]>([]);
  text: string = '';

  constructor(
    public dialog: MatDialog,
    public institucionesService: InstitucionesService,
    public paginatorService: PaginatorService
  ) {}

  ngOnInit(): void {
    this.getData();
  }

  getData() {
    const subscription =
      this.text !== ''
        ? this.institucionesService.search({ term: this.text, ...this.paginatorService.PaginationParams })
        : this.institucionesService.get(this.paginatorService.PaginationParams);
    subscription.subscribe((data) => {
      this.dataSource.set(data.institutions);
      this.paginatorService.length = data.length;
    });
  }

  add() {
    const dialogRef = this.dialog.open(InstitutionDialogComponent, {
      width: '700px',
    });
    dialogRef.afterClosed().subscribe((result?: institution) => {
      if (!result) return;
      this.dataSource.update((values) => [result, ...values]);
      this.paginatorService.length++;
    });
  }
  edit(data: institution) {
    const dialogRef = this.dialog.open(InstitutionDialogComponent, {
      width: '700px',
      data,
    });
    dialogRef.afterClosed().subscribe((result: institution) => {
      if (!result) return;
      this.dataSource.update((values) => {
        const index = values.findIndex((inst) => inst._id === result._id);
        values[index] = result;
        return [...values];
      });
    });
  }

  changeStatus(data: institution) {
    this.institucionesService.delete(data._id).subscribe((newState) => {
      this.dataSource.update((values) => {
        const index = values.findIndex((inst) => inst._id === data._id);
        values[index].activo = newState.activo;
        return [...values];
      });
    });
  }

  applyFilter(event: Event) {
    this.paginatorService.offset = 0;
    this.text = (event.target as HTMLInputElement).value;
    this.getData();
  }
  cancelSearch() {
    this.paginatorService.offset = 0;
    this.text = '';
    this.getData();
  }
}
