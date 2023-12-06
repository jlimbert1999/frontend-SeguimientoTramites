import { ProcedureTableColumns, ProcedureTableData } from 'src/app/reports/interfaces';

export interface ReportSheet {
  title: string;
  fields: { [key: string]: string };
  datasource: ProcedureTableData[];
  displayColumns: ProcedureTableColumns[];
}
