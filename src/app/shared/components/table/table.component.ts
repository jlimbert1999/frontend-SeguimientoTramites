import { Component, Input, signal, computed, ChangeDetectionStrategy, AfterViewInit, ViewChild } from '@angular/core';
import { MatPaginator } from '@angular/material/paginator';
import { MatSort } from '@angular/material/sort';
import { MatTableDataSource } from '@angular/material/table';
interface TableColumns {
  columnDef: string;
  header: string;
}
interface TableData {
  [key: string]: string | number;
}
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent implements AfterViewInit {
  public tableColumns = signal<TableColumns[]>([]);
  public dataSource = signal<MatTableDataSource<TableData>>(new MatTableDataSource());
  @Input({ required: true }) set data(data: TableData[]) {
    this.dataSource.set(new MatTableDataSource(data));
    this.dataSource().paginator = this.paginator;
    this.dataSource().sort = this.sort;
  }
  @Input({ required: true }) set columns(values: TableColumns[]) {
    this.tableColumns.set(values);
  }
  public displayedColumns = computed<string[]>(() => this.tableColumns().map((element) => element.columnDef));
  @ViewChild(MatPaginator) paginator: MatPaginator;
  @ViewChild(MatSort) sort: MatSort;

  ngAfterViewInit(): void {
    this.dataSource().paginator = this.paginator;
    this.dataSource().sort = this.sort;
  }

  applyFilter(event: Event) {
    const filterValue = (event.target as HTMLInputElement).value;
    this.dataSource().filter = filterValue.trim().toLowerCase();
    if (this.dataSource().paginator) {
      this.dataSource().paginator!.firstPage();
    }
  }
}
