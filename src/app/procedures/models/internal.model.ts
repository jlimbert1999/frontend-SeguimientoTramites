import { detailsInternal, internal } from '../interfaces';
import { Procedure } from './procedure.model';

export class InternalProcedure extends Procedure {
  details: detailsInternal;
  static fromJson(data: internal) {
    return new InternalProcedure(data);
  }
  constructor({ details, ...procedureProp }: internal) {
    super(procedureProp);
    this.details = details;
  }
}
