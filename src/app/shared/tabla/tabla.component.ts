import { AfterViewInit, Component, EventEmitter, Input, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { MatPaginator, PageEvent } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTable, MatTableDataSource } from '@angular/material/table';
import { fadeInOnEnterAnimation } from 'angular-animations';
import { DetallesMovilidadComponent } from 'src/app/Configuraciones/pages/funcionarios/detalles-movilidad/detalles-movilidad.component';
import { PaginationService } from 'src/app/Configuraciones/services/pagination.service';

@Component({
  selector: 'app-tabla',
  templateUrl: './tabla.component.html',
  styleUrls: ['./tabla.component.scss'],
  animations: [
    fadeInOnEnterAnimation({ duration: 500 })
  ]
})
export class TablaComponent implements OnInit {
  isLoadingResults = true;
  @Input() set dataTable(data: any[]) {
    if (data.length > this.paginationService.rows) {
      data.pop()
    }
    this.dataSource = new MatTableDataSource(data)
    if (this.paginationService.pageIndex === 0 && this.paginator) {
      this.paginator.firstPage()
    }
    this.isLoadingResults = false
  }
  @Input() displayedColumns: { key: string, titulo: string }[] = []

  dataSource = new MatTableDataSource<any>();
  columsTable: string[] = []

  @Output() llamarEditar: EventEmitter<object>;
  @Output() llamarCambiarSituacion: EventEmitter<object>;
  @Output() llamarHabilitar: EventEmitter<object>;
  @Output() eventoPaginacion: EventEmitter<any>;

  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;


  constructor(public paginationService: PaginationService, public dialog: MatDialog) {
    this.llamarEditar = new EventEmitter();
    this.llamarCambiarSituacion = new EventEmitter()
    this.llamarHabilitar = new EventEmitter()
    this.eventoPaginacion = new EventEmitter()
  }

  ngOnInit(): void {
    this.columsTable = this.displayedColumns.map((titulo: { key: string, titulo: string }) => titulo.key);
    this.columsTable = [...this.columsTable, 'opciones']
  }


  getPageDetails(event: PageEvent) {
    this.paginationService.pageIndex = event.pageIndex
    this.paginationService.rows = event.pageSize
    this.eventoPaginacion.emit(event)
  }
  editarDatos(datos: object) {
    this.llamarEditar.emit(datos);
  }
  cambiarSutacion(datos: object) {
    this.llamarCambiarSituacion.emit(datos)
  }
  habilitarDatos(datos: object) {
    this.llamarHabilitar.emit(datos)
  }

  // mostrar info funcionario
  mostrar_info(user:any) {
    this.dialog.open(DetallesMovilidadComponent, {
      width: '900px',
      data:user._id
    });
  }

}
