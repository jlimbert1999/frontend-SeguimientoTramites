import { Pipe, PipeTransform } from '@angular/core';
import { stateProcedure } from 'src/app/procedures/interfaces';

@Pipe({
  name: 'state',
})
export class StatePipe implements PipeTransform {
  transform(state: stateProcedure): string {
    let classSpan: string;
    switch (state) {
      case 'INSCRITO':
        classSpan = 'text-bg-primary';
        break;
      case 'EN REVISION':
        classSpan = 'text-bg-secondary';
        break;
      case 'OBSERVADO':
        classSpan = 'text-bg-warning';
        break;
      case 'CONCLUIDO':
        classSpan = 'text-bg-dark';
        break;
      case 'ANULADO':
        classSpan = 'text-bg-danger';
        break;
      case stateProcedure.SUSPENDIDO:
        classSpan = 'text-bg-info';
        break;
      default:
        classSpan = 'text-bg-light';
        break;
    }
    return classSpan;
  }
}
