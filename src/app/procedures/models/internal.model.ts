import { internalDetails, internal } from '../interfaces';
import { Procedure } from './procedure.model';

export class InternalProcedure extends Procedure {
  details: internalDetails;
  static fromJson(data: internal) {
    return new InternalProcedure(data);
  }
  constructor({ details, ...procedureProps }: internal) {
    super(procedureProps);
    this.details = details;
  }
}
