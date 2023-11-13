import { groupProcedure, stateProcedure } from 'src/app/procedures/interfaces';

export interface tableProcedureData {
  _id: string;
  code: string;
  applicant: string;
  startDate: string;
  reference: string;
  state: stateProcedure;
  group: groupProcedure;
}
