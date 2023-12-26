import { account, typeProcedure } from 'src/app/administration/interfaces';
import { external, worker, groupProcedure, typeApplicant, stateProcedure } from '../interfaces';
import { Procedure } from './procedure.model';

interface ExternalProps {
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
  solicitante: applicant;
  representante?: representative;
  requirements: string[];
  pin: number;
}

interface applicant {
  nombre: string;
  telefono: string;
  tipo: typeApplicant;
  paterno?: string;
  materno?: string;
  documento?: string;
  dni?: string;
}

interface representative {
  nombre: string;
  telefono: string;
  paterno: string;
  materno: string;
  documento: string;
  dni: string;
}

export class ExternalProcedure extends Procedure {
  details: details;

  static ResponseToModel({ send, ...values }: external) {
    return new ExternalProcedure({ ...values, isSend: true });
  }

  constructor({ details, ...procedureProps }: ExternalProps) {
    super({ ...procedureProps, group: groupProcedure.EXTERNAL });
    this.details = details;
  }

  get fullNameApplicant() {
    return this.details.solicitante.tipo === 'NATURAL'
      ? [this.details.solicitante.nombre, this.details.solicitante.paterno, this.details.solicitante.materno]
          .filter(Boolean)
          .join(' ')
      : this.details.solicitante.nombre;
  }

  get fullNameRepresentative() {
    if (!this.details.representante) return 'SIN REPRESENTANTE';
    return [this.details.representante.nombre, this.details.representante.paterno, this.details.representante.paterno]
      .filter(Boolean)
      .join(' ');
  }

  override get applicantDetails(): { emiter: worker; receiver?: worker | undefined } {
    return {
      emiter: { nombre: this.fullNameApplicant, cargo: `P. ${this.details.solicitante.tipo}` },
    };
  }
}
