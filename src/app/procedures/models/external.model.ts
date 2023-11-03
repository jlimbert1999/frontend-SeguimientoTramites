import { createExternalRouteMap } from '../helpers';
import { externalDetails, external, worker } from '../interfaces';
import { Procedure } from './procedure.model';

export class ExternalProcedure extends Procedure {

  generateRouteMap(): void {
    // createExternalRouteMap();
  }
  details: externalDetails;
  static fromJson(data: external) {
    return new ExternalProcedure(data);
  }
  constructor({ details, ...procedureProps }: external) {
    super(procedureProps);
    const { representante, ...detailsProp } = details;
    this.details = detailsProp;
    if (details.representante) this.details.representante = details.representante;
  }

  get fullNameApplicant() {
    return this.details.solicitante.tipo === 'NATURAL'
      ? [this.details.solicitante.nombre, this.details.solicitante.paterno, this.details.solicitante.paterno]
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
}
