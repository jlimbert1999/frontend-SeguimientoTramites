import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output } from '@angular/core';
import { ProcedureTableColumns, ProcedureTableData } from '../../interfaces';
interface navigationParams {
  path: string;
  queryParams: { limit: number; index: number };
}
@Component({
  selector: 'app-table-procedure',
  templateUrl: './table-procedure.component.html',
  styleUrl: './table-procedure.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class TableProcedureComponent {
  public displayedColumns: string[] = [];
  public pageParams: navigationParams;
  public columns: ProcedureTableColumns[] = [];

  @Input() dataSource: ProcedureTableData[] = [];
  @Input() set navigationParams(values: navigationParams) {
    this.pageParams = values;
  }
  @Input() set tableColumns(values: ProcedureTableColumns[]) {
    this.columns = values;
    this.displayedColumns = values.map(({ columnDef }) => columnDef);
  }
  @Output() showDetails = new EventEmitter<ProcedureTableData>();

  constructor() {}
}
