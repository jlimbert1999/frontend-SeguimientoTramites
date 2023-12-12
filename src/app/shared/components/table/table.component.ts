import { Component, Input, signal, type OnInit, computed, ChangeDetectionStrategy } from '@angular/core';
interface TableColumns {
  columnDef: string;
  header: string;
}
@Component({
  selector: 'app-table',
  templateUrl: './table.component.html',
  styleUrl: './table.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableComponent implements OnInit {
  private tableColumns = signal<TableColumns[]>([]);
  private datasource = signal<TableColumns[]>([]);
  @Input({ required: true }) set data: { [key: string]: string | number }[] = [];
  @Input({ required: true }) set columns(values: TableColumns[]) {
    this.tableColumns.set(values);
  }

  public displayedColumns = computed<string[]>(() => this.tableColumns().map((element) => element.columnDef));

  ngOnInit(): void {}
}
