import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DependenciasService } from '../../services/dependencias.service';
import { DependenciaDialogComponent } from './dependencia-dialog/dependencia-dialog.component';
import { dependency } from '../../interfaces/dependency.interface';
import { PaginatorService } from 'src/app/shared/services';

@Component({
  selector: 'app-dependencias',
  templateUrl: './dependencias.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class DependenciasComponent implements OnInit {
  text: string = '';
  dataSource = signal<dependency[]>([]);
  displayedColumns = ['sigla', 'nombre', 'codigo', 'institucion', 'activo', 'menu'];

  constructor(
    public dialog: MatDialog,
    public paginatorService: PaginatorService,
    public dependenciasService: DependenciasService
  ) {}

  ngOnInit(): void {
    this.getData();
  }
  getData() {
    const subscription =
      this.text !== ''
        ? this.dependenciasService.search({ term: this.text, ...this.paginatorService.PaginationParams })
        : this.dependenciasService.findAll(this.paginatorService.PaginationParams);
    subscription.subscribe((data) => {
      this.dataSource.set(data.dependencies);
      this.paginatorService.length = data.length;
    });
  }

  add() {
    const dialogRef = this.dialog.open(DependenciaDialogComponent, {
      width: '900px',
    });
    dialogRef.afterClosed().subscribe((result: dependency) => {
      if (!result) return;
      this.dataSource.update((values) => [result, ...values]);
      this.paginatorService.length++;
    });
  }

  edit(data: dependency) {
    const dialogRef = this.dialog.open(DependenciaDialogComponent, {
      width: '900px',
      data,
    });
    dialogRef.afterClosed().subscribe((result: dependency) => {
      if (!result) return;
      this.dataSource.update((values) => {
        const index = values.findIndex((inst) => inst._id === result._id);
        values[index] = result;
        return [...values];
      });
    });
  }

  changeStatus(data: dependency) {
    this.dependenciasService.delete(data._id).subscribe((newState) => {
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
