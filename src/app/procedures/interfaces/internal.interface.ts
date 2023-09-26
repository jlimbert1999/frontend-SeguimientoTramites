import { groupProcedure, procedure } from './procedure.interface';

export interface worker {
  nombre: string;
  cargo: string;
}
export interface detailsInternal {
  remitente: worker;
  destinatario: worker;
}
export interface internal extends procedure {
  group: groupProcedure.INTERNAL;
  details: detailsInternal;
}
