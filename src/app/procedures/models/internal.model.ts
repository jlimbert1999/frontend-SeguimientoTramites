import { account, typeProcedure } from 'src/app/administration/interfaces';
import { internalDetails, internal, stateProcedure, groupProcedure } from '../interfaces';
import { Procedure } from './procedure.model';

interface InternalProps {
  _id: string;
  code: string;
  cite: string;
  amount: string;
  isSend: boolean;
  reference: string;
  endDate?: string;
  startDate: string;
  account: account;
  type: typeProcedure;
  state: stateProcedure;
  details: details;
}
interface details {
  remitente: worker;
  destinatario: worker;
}

interface worker {
  nombre: string;
  cargo: string;
}

export class InternalProcedure extends Procedure {
  details: internalDetails;
  static ResponseToModel({ send, ...values }: internal) {
    return new InternalProcedure({ ...values, isSend: send });
  }
  constructor({ details, ...procedureProps }: InternalProps) {
    super({ ...procedureProps, group: groupProcedure.INTERNAL });
    this.details = details;
  }

  override get applicantDetails() {
    return {
      emiter: { nombre: this.details.remitente.nombre, cargo: this.details.remitente.cargo },
      receiver: { nombre: this.details.destinatario.nombre, cargo: this.details.destinatario.cargo },
    };
  }
}
