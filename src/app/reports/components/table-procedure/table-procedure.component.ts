import { Component, EventEmitter, Input, Output } from '@angular/core';
import { procedureTableColumns, procedureTableData } from '../../interfaces';

@Component({
  selector: 'app-table-procedure',
  templateUrl: './table-procedure.component.html',
  styleUrl: './table-procedure.component.scss',
})
export class TableProcedureComponent {
  public displayedColumns: string[] = [];
  public colums: procedureTableColumns[] = [];
  @Input() public dataSource: procedureTableData[] = [];
  @Input() set tableColumns(values: procedureTableColumns[]) {
    this.colums = values;
    this.displayedColumns = values.map(({ columnDef }) => columnDef);
  }
  @Output() showDetails = new EventEmitter<procedureTableData>();

  viewDetails(element: procedureTableData) {
    this.showDetails.emit(element);
  }
}
