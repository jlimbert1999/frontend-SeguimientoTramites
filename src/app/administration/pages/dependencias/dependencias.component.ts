import { Component, ElementRef, OnInit, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { DependenciasService } from '../../services/dependencias.service';
import { DependenciaDialogComponent } from './dependencia-dialog/dependencia-dialog.component';
import { dependency } from '../../interfaces/dependency.interface';
import {PaginatorService} from 'src/app/shared/services';

@Component({
  selector: 'app-dependencias',
  templateUrl: './dependencias.component.html',
  styleUrls: ['./dependencias.component.scss'],
})
export class DependenciasComponent implements OnInit {
  text: string = '';
  dataSource: dependency[] = [];
  displayedColumns = ['sigla', 'nombre', 'codigo', 'institucion', 'activo', 'options'];
  constructor(
    public dialog: MatDialog,
    public dependenciasService: DependenciasService,
    public paginatorService:PaginatorService
  ) {}

  ngOnInit(): void {
    this.Get();
  }
  Get() {
    if (this.text !== '') {
      this.dependenciasService
        .search(this.paginatorService.limit, this.paginatorService.offset, this.text)
        .subscribe((data) => {
          this.dataSource = data.dependencies;
          this.paginatorService.length = data.length;
        });
    } else {
      this.dependenciasService.get(this.paginatorService.limit, this.paginatorService.offset).subscribe((data) => {
        this.dataSource = data.dependencies;
        this.paginatorService.length = data.length;
      });
    }
  }

  Add() {
    const dialogRef = this.dialog.open(DependenciaDialogComponent, {
      width: '900px',
    });
    dialogRef.afterClosed().subscribe((result: dependency) => {
      if (result) {
        if (this.dataSource.length === this.paginatorService.limit) {
          this.dataSource.pop();
        }
        this.paginatorService.length++;
        this.dataSource = [result, ...this.dataSource];
      }
    });
  }
  Edit(data: dependency) {
    const dialogRef = this.dialog.open(DependenciaDialogComponent, {
      width: '900px',
      data,
    });
    dialogRef.afterClosed().subscribe((result: dependency) => {
      if (result) {
        console.log(result);
        const indexFound = this.dataSource.findIndex((element) => element._id === result._id);
        this.dataSource[indexFound] = result;
        this.dataSource = [...this.dataSource];
      }
    });
  }

  Delete(data: dependency) {
    this.dependenciasService.delete(data._id).subscribe((isActive) => {
      const indexFound = this.dataSource.findIndex((element) => element._id === data._id);
      this.dataSource[indexFound].activo = isActive;
      this.dataSource = [...this.dataSource];
    });
  }
  applyFilter(event: Event) {
    this.paginatorService.offset = 0;
    this.text = (event.target as HTMLInputElement).value;
    this.Get();
  }
  cancelSearch() {
    this.paginatorService.offset = 0;
    this.text = '';
    this.Get();
  }
}
