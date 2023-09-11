import { applicant, representative } from '../interfaces';

export class ExternalProcedureDto {
  static fromForm(
    FormProcedure: any,
    requeriments: string[],
    FormApplicant: any,
    FormRepresentative: any
  ) {
    return Object.keys(FormRepresentative).length > 0
      ? new ExternalProcedureDto(
          FormProcedure['type'],
          FormProcedure['cite'],
          FormProcedure['reference'],
          FormProcedure['amount'],
          FormApplicant,
          requeriments
        )
      : new ExternalProcedureDto(
          FormProcedure['type'],
          FormProcedure['cite'],
          FormProcedure['reference'],
          FormProcedure['amount'],
          FormApplicant,
          requeriments
        );
  }
  procedure: {
    cite: string;
    reference: string;
    amount: string;
    type: string;
  };
  details: {
    requerimientos: string[];
    solicitante: applicant;
    representante?: representative;
    pin: number;
  };
  constructor(
    type: string,
    cite: string,
    reference: string,
    amount: string,
    applicant: applicant,
    requirements: string[],
    representative?: representative
  ) {
    this.procedure = {
      cite,
      reference,
      amount,
      type,
    };
    this.details = {
      solicitante: applicant,
      requerimientos: requirements,
      pin: Math.floor(100000 + Math.random() * 900000),
    };
    if (representative) this.details.representante = representative;
  }
}
