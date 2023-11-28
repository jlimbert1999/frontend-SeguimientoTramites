import { groupProcedure } from 'src/app/procedures/interfaces';

export interface ProcedureTableColumns {
  columnDef: string;
  header: string;
}
export interface ProcedureTableData {
  id_procedure: string;
  group: groupProcedure;
  [key: string]: string;
}
