import { Component, EventEmitter, Input, Output } from '@angular/core';
import { tableProcedureData } from '../../interfaces';
import { Router } from '@angular/router';
import { groupProcedure } from 'src/app/procedures/interfaces';

@Component({
  selector: 'app-table-procedure',
  templateUrl: './table-procedure.component.html',
  styleUrl: './table-procedure.component.scss',
})
export class TableProcedureComponent {
  public displayedColumns: string[] = [];
  public dataSource: tableProcedureData[] = [];
  public tableColumns: { columnDef: string; header: string }[] = [
    { columnDef: 'code', header: 'Alterno' },
    { columnDef: 'reference', header: 'Referencia' },
    { columnDef: 'applicant', header: 'Solicitante' },
    { columnDef: 'state', header: 'Estado' },
    { columnDef: 'startDate', header: 'Fecha' },
  ];

  @Input() set setTableColumns(values: tableProcedureData[]) {
    this.displayedColumns = this.tableColumns.map(({ columnDef }) => columnDef);
    this.dataSource = values;
  }
  @Output() showDetails = new EventEmitter<tableProcedureData>();

  viewDetails(element: tableProcedureData) {
    this.showDetails.emit(element);
  }
}
