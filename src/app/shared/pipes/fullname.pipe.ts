import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'fullname',
})
export class FullnamePipe implements PipeTransform {
  transform(officer: { nombre: string; paterno: string; materno: string } | undefined): string {
    if (!officer) return '--SIN FUNCIONARIO--';
    return [officer.nombre, officer.paterno, officer.materno].filter(Boolean).join(' ');
  }
}
