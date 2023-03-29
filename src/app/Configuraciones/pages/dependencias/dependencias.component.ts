import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatTableDataSource } from '@angular/material/table';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { PaginatorService } from 'src/app/shared/services/paginator.service';
import { Dependencia } from '../../models/dependencia.interface';
import { DependenciaModel } from '../../models/dependencia.model';
import { DependenciasService } from '../../services/dependencias.service';

import { DependenciaDialogComponent } from './dependencia-dialog/dependencia-dialog.component';

@Component({
  selector: 'app-dependencias',
  templateUrl: './dependencias.component.html',
  styleUrls: ['./dependencias.component.css'],
  animations: [
    fadeInOnEnterAnimation(),
  ]
})
export class DependenciasComponent implements OnInit {
  text: string = ''
  dataSource: Dependencia[] = []
  displayedColumns = ['sigla', 'nombre', 'codigo', 'institucion', 'activo', 'opciones']
  @ViewChild("txtSearch") private searchInput: ElementRef;
  constructor(
    public dialog: MatDialog,
    public dependenciasService: DependenciasService,
    public paginatorService: PaginatorService
  ) { }

  ngOnInit(): void {
    this.Get()
  }
  Get() {
    if (this.text !== '') {
      this.dependenciasService.search(this.paginatorService.limit, this.paginatorService.offset, this.text).subscribe(data => {
        this.dataSource = data.dependencias
        this.paginatorService.length = data.length
      })
    }
    else {
      this.dependenciasService.get(this.paginatorService.limit, this.paginatorService.offset).subscribe(data => {
        this.dataSource = data.dependencias
        this.paginatorService.length = data.length
      })
    }

  }


  Add() {
    const dialogRef = this.dialog.open(DependenciaDialogComponent, {
      width: '700px'
    });
    dialogRef.afterClosed().subscribe((result: Dependencia) => {
      if (result) {
        if (this.dataSource.length === this.paginatorService.limit) {
          this.dataSource.pop()
        }
        this.paginatorService.length++
        this.dataSource = [result, ...this.dataSource]
      }
    });
  }
  Edit(data: Dependencia) {
    const dialogRef = this.dialog.open(DependenciaDialogComponent, {
      width: '700px',
      data
    });
    dialogRef.afterClosed().subscribe((result: Dependencia) => {
      if (result) {
        let newData = [...this.dataSource]
        const indexFound = newData.findIndex(element => element.id_dependencia === data.id_dependencia)
        newData[indexFound] = result
        this.dataSource = newData
      }
    });
  }

  Delete(data: Dependencia) {
    this.dependenciasService.delete(data.id_dependencia).subscribe(dependencia => {
      let newData = [...this.dataSource]
      const indexFound = newData.findIndex(element => element.id_dependencia === data.id_dependencia)
      newData[indexFound] = dependencia
      this.dataSource = newData
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
