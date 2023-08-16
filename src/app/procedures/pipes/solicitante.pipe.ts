import { Pipe, PipeTransform } from '@angular/core';
import {} from '../interfaces/external.interface';
import { applicant } from '../interfaces/external_detail.interface';

@Pipe({
  name: 'solicitante',
})
export class SolicitantePipe implements PipeTransform {
  transform(applicant: applicant): string {
    if (!applicant) return 'Desconocido';
    return applicant.tipo === 'NATURAL'
      ? `${applicant.nombre} ${applicant.paterno} ${applicant.materno}`
      : applicant.nombre;
  }
}
