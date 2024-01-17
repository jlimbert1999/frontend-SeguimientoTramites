import { ChangeDetectionStrategy, Component, OnInit, signal } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { InstitucionesService } from '../../services/instituciones.service';
import { InstitutionDialogComponent } from '../../dialogs/institution-dialog/institution-dialog.component';
import { institution } from '../../interfaces/institution.interface';
import { PaginatorService } from 'src/app/shared/services';

@Component({
  selector: 'app-instituciones',
  templateUrl: './instituciones.component.html',
  styleUrls: ['./instituciones.component.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class InstitucionesComponent implements OnInit {
  displayedColumns: string[] = ['sigla', 'nombre', 'situacion', 'simple'];
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

  add() {
    const dialogRef = this.dialog.open(InstitutionDialogComponent, {
      width: '700px',
    });
    dialogRef.afterClosed().subscribe((result: institution) => {
      if (result) {
      }
    });
  }
  Edit(data: institution) {
    const dialogRef = this.dialog.open(InstitutionDialogComponent, {
      width: '700px',
      data,
    });
    dialogRef.afterClosed().subscribe((result: institution) => {
      if (result) {
      }
    });
  }
  Delete(data: institution) {
    this.institucionesService.delete(data._id).subscribe((newState) => {});
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
