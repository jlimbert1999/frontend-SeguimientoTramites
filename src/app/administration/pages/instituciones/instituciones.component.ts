import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { InstitucionesService } from '../../services/instituciones.service';
import { InstitutionDialogComponent } from '../../dialogs/institution-dialog/institution-dialog.component';
import { institution } from '../../interfaces/institution.interface';

@Component({
  selector: 'app-instituciones',
  templateUrl: './instituciones.component.html',
  styleUrls: ['./instituciones.component.scss']
})
export class InstitucionesComponent implements OnInit {
  displayedColumns: string[] = ['sigla', 'nombre', 'situacion', 'options'];
  dataSource: institution[] = []
  text: string = ''

  constructor(
    public dialog: MatDialog,
    public institucionesService: InstitucionesService,
    public paginatorService: PaginatorService
  ) { }

  ngOnInit(): void {
    this.Get()
  }

  Add() {
    const dialogRef = this.dialog.open(InstitutionDialogComponent, {
      width: '700px'
    });
    dialogRef.afterClosed().subscribe((result: institution) => {
      if (result) {
        if (this.dataSource.length === this.paginatorService.limit) {
          this.dataSource.pop()
        }
        this.paginatorService.length++
        this.dataSource = [result, ...this.dataSource]
      }
    });
  }
  Edit(data: institution) {
    const dialogRef = this.dialog.open(InstitutionDialogComponent, {
      width: '700px',
      data
    });
    dialogRef.afterClosed().subscribe((result: institution) => {
      if (result) {
        const foundIndex = this.dataSource.findIndex(inst => inst._id === result._id);
        if (foundIndex >= 0) {
          this.dataSource[foundIndex] = result
          this.dataSource = [...this.dataSource]
        }
      }
    });
  }
  Delete(data: institution) {
    this.institucionesService.delete(data._id).subscribe(newState => {
      const foundIndex = this.dataSource.findIndex(inst => inst._id === data._id);
      if (foundIndex >= 0) {
        this.dataSource[foundIndex].activo = newState
        this.dataSource = [...this.dataSource]
      }
    })
  }

  Get() {
    if (this.text !== '') {
      this.institucionesService.search(this.paginatorService.limit, this.paginatorService.offset, this.text).subscribe(data => {
        this.dataSource = data.institutions
        this.paginatorService.length = data.length
      })
    }
    else {
      this.institucionesService.get(this.paginatorService.limit, this.paginatorService.offset).subscribe(data => {
        this.dataSource = data.institutions
        this.paginatorService.length = data.length
      })
    }
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
