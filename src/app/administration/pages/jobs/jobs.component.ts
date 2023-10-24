import { Component } from '@angular/core';
import { CargoService } from '../../services/cargo.service';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { MatDialog } from '@angular/material/dialog';
import { job } from '../../interfaces/job.interface';
import { JobDialogComponent } from '../../dialogs/job-dialog/job-dialog.component';

@Component({
  selector: 'app-jobs',
  templateUrl: './jobs.component.html',
  styleUrls: ['./jobs.component.scss']
})
export class JobsComponent {
  text: string = ''
  dataSource: job[] = []
  displayedColumns = ['nombre','options']
  constructor(
    private cargoService: CargoService,
    private paginatorService: PaginatorService,
    public dialog: MatDialog,
  ) {
    this.Get()
  }

  Get() {
    if (this.text !== '') {
      this.cargoService.search(this.paginatorService.limit, this.paginatorService.offset, this.text).subscribe(data => {
        this.dataSource = data.jobs
        this.paginatorService.length = data.length
      })
    }
    else {
      this.cargoService.get(this.paginatorService.limit, this.paginatorService.offset).subscribe(data => {
        this.dataSource = data.jobs
        this.paginatorService.length = data.length
      })
    }
  }

  Edit(item: job) {
    const dialogRef = this.dialog.open(JobDialogComponent, {
      width: '800px',
      data: item
    });
    dialogRef.afterClosed().subscribe((result: job) => {
      if (result) {
        console.log(result);
        const index = this.dataSource.findIndex(element => element._id === result._id);
        this.dataSource[index] = result
        this.dataSource = [...this.dataSource]
      }
    });
  }
  add() {
    const dialogRef = this.dialog.open(JobDialogComponent, {
      width: '800px'
    });
    dialogRef.afterClosed().subscribe((result: job) => {
      if (result) {
        console.log(result);
        if (this.dataSource.length === this.paginatorService.limit) {
          this.dataSource.pop()
        }
        this.dataSource = [result, ...this.dataSource]
      }
    })
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
