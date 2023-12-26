import { account, typeProcedure } from 'src/app/administration/interfaces';
import { groupProcedure, stateProcedure } from '..';

export interface procedure {
  _id: string;
  code: string;
  cite: string;
  reference: string;
  amount: string;
  send: boolean;
  startDate: string;
  endDate?: string;
  type: typeProcedure;
  account: account;
  state: stateProcedure;
  group: groupProcedure;
}
