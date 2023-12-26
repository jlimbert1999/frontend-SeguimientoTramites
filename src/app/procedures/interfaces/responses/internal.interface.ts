import { groupProcedure, procedure, worker } from '../';

export interface internal extends procedure {
  group: groupProcedure.INTERNAL;
  details: internalDetails;
}
export interface internalDetails {
  remitente: worker;
  destinatario: worker;
}
