import { groupProcedure, stateProcedure } from 'src/app/procedures/interfaces';

export interface ProcedureTableData {
  id_procedure: string;
  group: groupProcedure;
  state: stateProcedure;
  reference: string;
  applicant?: string;
  date: string;
  code: string;
}
