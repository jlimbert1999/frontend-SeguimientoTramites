import { ProcedureTableColumns, ProcedureTableData } from 'src/app/reports/interfaces';

export interface ReportSheet {
  title: string;
  subtitle?: string;
  datasource: ProcedureTableData[];
  displayColumns: ProcedureTableColumns[];
}
