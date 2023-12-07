import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ProcedureTableColumns, ProcedureTableData } from '../../interfaces';

@Component({
  selector: 'app-table-procedure',
  templateUrl: './table-procedure.component.html',
  styleUrl: './table-procedure.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableProcedureComponent {
  public displayedColumns: string[] = [];
  public colums: ProcedureTableColumns[] = [];

  @Input() dataSource: ProcedureTableData[] = [];
  @Input() set tableColumns(values: ProcedureTableColumns[]) {
    this.colums = values;
    this.displayedColumns = values.map(({ columnDef }) => columnDef);
  }
  @Output() showDetails = new EventEmitter<ProcedureTableData>();

  viewDetails(element: ProcedureTableData) {
    this.showDetails.emit(element);
  }
}
