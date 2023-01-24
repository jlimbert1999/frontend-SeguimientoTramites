import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fullname'
})
export class FullnamePipe implements PipeTransform {

  transform(funcionario: { nombre: string, paterno: string, materno: string }): string {
    let fullname
    if (funcionario.materno !== '') {
      fullname = `${funcionario.nombre} ${funcionario.paterno} ${funcionario.materno}`
    }
    else {
      fullname = `${funcionario.nombre} ${funcionario.paterno}`
    }
    return fullname
  }

}
