import { Component, OnInit } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { Institucion } from '../../models/institucion.model';
import { InstitucionesService } from '../../services/instituciones.service';
import { InstitucionDialogComponent } from './institucion-dialog/institucion-dialog.component';

@Component({
  selector: 'app-instituciones',
  templateUrl: './instituciones.component.html',
  styleUrls: ['./instituciones.component.scss'],
  animations: [
    fadeInOnEnterAnimation(),
  ]
})
export class InstitucionesComponent implements OnInit {
  displayedColumns: string[] = ['sigla', 'nombre', 'situacion', 'opciones'];
  dataSource: Institucion[] = []
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
    const dialogRef = this.dialog.open(InstitucionDialogComponent, {
      width: '700px'
    });
    dialogRef.afterClosed().subscribe((result: Institucion) => {
      if (result) {
        if (this.dataSource.length === this.paginatorService.limit) {
          this.dataSource.pop()
        }
        this.paginatorService.length++
        this.dataSource = [result, ...this.dataSource]
      }
    });
  }
  Edit(data: Institucion) {
    const dialogRef = this.dialog.open(InstitucionDialogComponent, {
      width: '700px',
      data
    });
    dialogRef.afterClosed().subscribe((result: Institucion) => {
      if (result) {
        let newData = [...this.dataSource]
        const foundIndex = newData.findIndex(int => int.id_institucion === data.id_institucion);
        newData[foundIndex] = result;
        this.dataSource = newData
      }
    });
  }
  Delete(data: Institucion) {
    this.institucionesService.delete(data.id_institucion!).subscribe(inst => {
      let newData = [...this.dataSource]
      const foundIndex = newData.findIndex(int => int.id_institucion === data.id_institucion);
      newData[foundIndex] = inst
      this.dataSource = newData
    })
  }

  Get() {
    if (this.text !== '') {
      this.institucionesService.search(this.paginatorService.limit, this.paginatorService.offset, this.text).subscribe(data => {
        this.dataSource = data.instituciones
        this.paginatorService.length = data.length
      })
    }
    else {
      this.institucionesService.get(this.paginatorService.limit, this.paginatorService.offset).subscribe(data => {
        this.dataSource = data.instituciones
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
