import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fullname'
})
export class FullnamePipe implements PipeTransform {

  transform(funcionario: { nombre: string, paterno: string, materno: string }): string {
    return [funcionario.nombre, funcionario.paterno, funcionario.materno].filter(Boolean).join(" ");

  }

}
