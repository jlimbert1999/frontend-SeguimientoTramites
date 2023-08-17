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
          FormProcedure['reference'],
          FormProcedure['amount'],
          requeriments,
          FormProcedure['cite'],
          FormApplicant,
          FormRepresentative
        )
      : new ExternalProcedureDto(
          FormProcedure['type'],
          FormProcedure['reference'],
          FormProcedure['amount'],
          requeriments,
          FormProcedure['cite'],
          FormApplicant
        );
  }
  pin: number;
  representante?: {
    nombre: string;
    paterno: string;
    materno: string;
    documento: string;
    telefono: number;
    dni: number;
  };
  constructor(
    public type: string,
    public reference: string,
    public amount: string,
    public requirements: string[],
    public cite: string,
    public solicitante: {
      nombre: string;
      telefono: number;
      tipo: string;
      paterno?: string;
      materno?: string;
      documento?: string;
      dni?: number;
    },
    representante?: {
      nombre: string;
      paterno: string;
      materno: string;
      documento: string;
      telefono: number;
      dni: number;
    }
  ) {
    this.pin = Math.floor(100000 + Math.random() * 900000);
    if (representante) this.representante = representante;
  }
}
