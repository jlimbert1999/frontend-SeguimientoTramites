import { account, typeProcedure } from 'src/app/administration/interfaces';
export enum stateProcedure {
  INSCRITO = 'INSCRITO',
  OBSERVADO = 'OBSERVADO',
  REVISION = 'EN REVISION',
  CONCLUIDO = 'CONCLUIDO',
  ANULADO = 'ANULADO',
}
export enum groupProcedure {
  EXTERNAL = 'ExternalDetail',
  INTERNAL = 'InternalDetail',
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
  group: groupProcedure;
  endDate?: string;
  completionReason?: string;
}
