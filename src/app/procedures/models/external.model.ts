import { detailsExternal, external } from '../interfaces';
import { Procedure } from './procedure.model';

export class ExternalProcedure extends Procedure {
  details: detailsExternal;
  static fromJson(data: external) {
    return new ExternalProcedure(data);
  }
  constructor({ details, ...procedureProp }: external) {
    super(procedureProp);
    const { representante, ...detailsProp } = details;
    this.details = detailsProp;
    if (details.representante)
      this.details.representante = details.representante;
  }

  get fullNameApplicant() {
    return this.details.solicitante.tipo === 'NATURAL'
      ? [
          this.details.solicitante.nombre,
          this.details.solicitante.paterno,
          this.details.solicitante.paterno,
        ]
          .filter(Boolean)
          .join(' ')
      : this.details.solicitante.nombre;
  }

  get fullNameRepresentative() {
    if (!this.details.representante) return 'SIN REPRESENTANTE';
    return [
      this.details.representante.nombre,
      this.details.representante.paterno,
      this.details.representante.paterno,
    ]
      .filter(Boolean)
      .join(' ');
  }
}
