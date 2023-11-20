import { groupProcedure, stateProcedure } from 'src/app/procedures/interfaces';

export interface procedureTableData {
  _id: string;
  code: string;
  applicant?: string;
  startDate: string;
  reference: string;
  state: stateProcedure;
  group: groupProcedure;
}

export interface procedureTableColumns {
  columnDef: string;
  header: string;
}
