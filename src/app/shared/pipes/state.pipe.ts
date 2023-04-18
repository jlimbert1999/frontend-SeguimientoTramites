import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'state'
})
export class StatePipe implements PipeTransform {

  transform(state: string): string {
    let classSpan: string
    switch (state) {
      case 'INSCRITO':
        classSpan = 'text-bg-primary'
        break;
      case 'EN REVISION':
        classSpan = 'text-bg-secondary'
        break;
      case 'OBSERVADO':
        classSpan = 'text-bg-warning'
        break;
      case 'CONCLUIDO':
        classSpan = 'text-bg-dark'
        break;
      case 'ANULADO':
        classSpan = 'text-bg-danger'
        break;
      default:
        classSpan = ''
        break;
    }
    return classSpan
  }

}
