import { Component, EventEmitter, Input, OnChanges, OnInit, Output, SimpleChanges, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatTableDataSource } from '@angular/material/table';

@Component({
  selector: 'app-table-report-precedures',
  templateUrl: './table-report-precedures.component.html',
  styleUrls: ['./table-report-precedures.component.scss']
})
export class TableReportPreceduresComponent implements OnInit, OnChanges {
  @Input() data: any[] = []
  @Input() group: string = ''
  @Input() colums: { key: string, titulo: string }[] = []

  displayedColumns: string[] = []
  dataSource = new MatTableDataSource();
  @ViewChild(MatPaginator) paginator: MatPaginator;

  @Output() print: EventEmitter<string> = new EventEmitter();

  ngAfterViewInit(): void {
    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.paginator = this.paginator;
  }

  ngOnInit(): void {
    this.displayedColumns = this.colums.map((titulo: { key: string, titulo: string }) => titulo.key);
    this.displayedColumns = [...this.displayedColumns, 'opciones']
  }


  ngOnChanges(changes: SimpleChanges): void {
    this.displayedColumns = this.colums.map((titulo: { key: string, titulo: string }) => titulo.key);
    this.displayedColumns = [...this.displayedColumns, 'opciones']
    this.dataSource = new MatTableDataSource(this.data);
    this.dataSource.paginator = this.paginator;
  }
  
  callPrint(tramite:any) {
    this.print.emit(tramite);
  }

}
