import { worker } from '../interfaces';

export class InternalProcedureDto {
  static fromForm(FormProcedure: any) {
    return new InternalProcedureDto(
      FormProcedure['type'],
      FormProcedure['cite'],
      FormProcedure['reference'],
      FormProcedure['amount'],
      {
        nombre: FormProcedure['fullname_emitter'],
        cargo: FormProcedure['jobtitle_emitter'],
      },
      {
        nombre: FormProcedure['fullname_receiver'],
        cargo: FormProcedure['jobtitle_receiver'],
      }
    );
  }
  procedure: {
    cite: string;
    reference: string;
    amount: string;
    type: string;
  };
  details: {
    remitente: worker;
    destinatario: worker;
  };
  constructor(
    type: string,
    cite: string,
    reference: string,
    amount: string,
    emitter: worker,
    receiver: worker
  ) {
    this.procedure = {
      cite,
      reference,
      amount,
      type,
    };
    this.details = {
      remitente: emitter,
      destinatario: receiver,
    };
  }
}
