import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'solicitante'
})
export class SolicitantePipe implements PipeTransform {

  transform(value: { nombre: string, paterno: string, materno: string, tipo: 'NATURAL' | 'JURIDICO' }): string {
    if (value.tipo === 'NATURAL') {
      return `${value.nombre} ${value.paterno} ${value.materno}`
    }
    return value.nombre


  }

}
