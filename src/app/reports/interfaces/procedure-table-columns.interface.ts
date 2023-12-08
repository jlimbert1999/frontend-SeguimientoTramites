import { ProcedureTableData } from './procedure-table-data.interace';

export interface ProcedureTableColumns {
  columnDef: keyof ProcedureTableData;
  header: string;
}
