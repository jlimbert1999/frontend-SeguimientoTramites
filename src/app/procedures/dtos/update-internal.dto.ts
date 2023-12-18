import { worker } from '../interfaces';
import { Person } from './create-internal.dto';

export class UpdateInternalProcedureDto {
  static fromForm(FormProcedure: any) {
    const emitter = {
      nombre: FormProcedure['fullname_emitter'],
      cargo: FormProcedure['jobtitle_emitter'],
    };
    const receiver = {
      nombre: FormProcedure['fullname_receiver'],
      cargo: FormProcedure['jobtitle_receiver'],
    };
    return new UpdateInternalProcedureDto(
      {
        cite: FormProcedure['cite'],
        reference: FormProcedure['reference'],
        amount: FormProcedure['amount'],
      },
      { remitente: emitter, destinatario: receiver }
    );
  }
  constructor(
    public procedure: {
      cite?: string;
      reference?: string;
      amount?: string;
    },
    public details: {
      remitente?: worker;
      destinatario?: worker;
    }
  ) {}
}
