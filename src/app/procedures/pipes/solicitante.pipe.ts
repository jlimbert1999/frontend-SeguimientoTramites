import { Pipe, PipeTransform } from '@angular/core';
import { applicant, typeApplicant } from '../interfaces/external.interface';

@Pipe({
  name: 'solicitante'
})
export class SolicitantePipe implements PipeTransform {

  transform(applicant: applicant): string {
    return applicant.tipo === 'NATURAL'
      ? `${applicant.nombre} ${applicant.paterno} ${applicant.materno}`
      : applicant.nombre
  }

}
