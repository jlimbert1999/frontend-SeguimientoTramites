import { account, typeProcedure } from 'src/app/administration/interfaces';
export enum stateProcedure {
  INSCRITO = 'INSCRITO',
  OBSERVADO = 'OBSERVADO',
  REVISION = 'EN REVISION',
  CONCLUIDO = 'CONCLUIDO',
}
export interface procedure {
  _id: string;
  code: string;
  cite: string;
  type: typeProcedure;
  account: account;
  state: stateProcedure;
  reference: string;
  amount: string;
  send: boolean;
  startDate: string;
  endDate?: string;
  group: string;
  tramite: string;
}
