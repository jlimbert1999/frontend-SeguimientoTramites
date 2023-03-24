import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'solicitante'
})
export class SolicitantePipe implements PipeTransform {

  transform(value: { nombre: string, paterno: string, materno: string, tipo: 'NATURAL' | 'JURIDICO' }, ...args: unknown[]): unknown {
    let name
    switch (value.tipo) {
      case 'NATURAL':
        name = `${value.nombre} ${value.paterno} ${value.materno}`
        break;
      case 'JURIDICO':
        name = `${value.nombre}`
        break;
    }
    return name;
  }

}
