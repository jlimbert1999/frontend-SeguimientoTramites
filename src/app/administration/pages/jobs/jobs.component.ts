import { ChangeDetectionStrategy, Component, signal } from '@angular/core';
import { CargoService } from '../../services/cargo.service';
import { MatDialog } from '@angular/material/dialog';
import { job } from '../../interfaces/job.interface';
import { JobDialogComponent } from '../job-dialog/job-dialog.component';
import { PaginatorService } from 'src/app/shared/services';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class JobsComponent {
  text: string = '';
  dataSource = signal<job[]>([]);
  displayedColumns = ['name', 'options'];
  constructor(
    private cargoService: CargoService,
    private paginatorService: PaginatorService,
    public dialog: MatDialog
  ) {
    this.getData();
  }

  getData() {
    const supscription =
      this.text !== ''
        ? this.cargoService.search({ text: this.text, ...this.paginatorService.PaginationParams })
        : this.cargoService.findAll(this.paginatorService.PaginationParams);
    supscription.subscribe((data) => {
      this.dataSource.set(data.jobs);
      this.paginatorService.length = data.length;
    });
  }

  edit(item: job) {
    const dialogRef = this.dialog.open(JobDialogComponent, {
      width: '800px',
      data: item,
    });
    dialogRef.afterClosed().subscribe((result?: job) => {
      if (!result) return;
      this.dataSource.update((values) => {
        const index = values.findIndex((element) => element._id === result._id);
        values[index] = result;
        return [...values];
      });
    });
  }
  add() {
    const dialogRef = this.dialog.open(JobDialogComponent, {
      width: '800px',
    });
    dialogRef.afterClosed().subscribe((result?: job) => {
      if (!result) return;
      this.dataSource.update((values) => [result, ...values]);
      this.paginatorService.length++;
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
