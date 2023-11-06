import { internalDetails, internal, worker } from '../interfaces';
import { Procedure } from './procedure.model';

export class InternalProcedure extends Procedure {
  details: internalDetails;
  static toModel(data: internal) {
    return new InternalProcedure(data);
  }
  constructor({ details, ...procedureProps }: internal) {
    super(procedureProps);
    this.details = details;
  }

  override get applicantDetails(): { emiter: worker; receiver?: worker } {
    return {
      emiter: { nombre: this.details.remitente.nombre, cargo: this.details.remitente.cargo },
      receiver: { nombre: this.details.destinatario.nombre, cargo: this.details.destinatario.cargo },
    };
  }
}
