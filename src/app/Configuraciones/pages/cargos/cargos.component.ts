import { Component } from '@angular/core';
import { CargoService } from '../../services/cargo.service';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { CargoDialogComponent } from '../../dialogs/cargo-dialog/cargo-dialog.component';
import { MatDialog } from '@angular/material/dialog';
import { job } from '../../interfaces/job.interface';

@Component({
  selector: 'app-cargos',
  templateUrl: './cargos.component.html',
  styleUrls: ['./cargos.component.scss'],
  animations: [
    fadeInOnEnterAnimation(),
  ]
})
export class CargosComponent {
  text: string = ''
  dataSource: job[] = []
  displayedColumns = ['nombre', 'opciones']
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

  Edit(cargo: any) {
    const dialogRef = this.dialog.open(CargoDialogComponent, {
      width: '800px',
      data: cargo
    });
    // dialogRef.afterClosed().subscribe((result: role) => {
    //   if (result) {
    //     const index = this.dataSource.findIndex(element => element._id === result._id);
    //     this.dataSource[index] = result
    //     this.dataSource = [...this.dataSource]
    //   }
    // });
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
