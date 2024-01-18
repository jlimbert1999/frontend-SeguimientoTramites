interface DependencyProps {
  nombre: string;
  sigla: string;
  codigo: string;
  institucion: string;
}

export class CreateDependencyDto {
  nombre: string;
  sigla: string;
  codigo: string;
  institucion: string;
  static FormToModel(form: any) {
    return new CreateDependencyDto({
      nombre: form['nombre'],
      sigla: form['sigla'],
      codigo: form['codigo'],
      institucion: form['institucion'],
    });
  }
  constructor({ nombre, sigla, codigo, institucion }: DependencyProps) {
    this.nombre = nombre;
    this.sigla = sigla;
    this.codigo = codigo;
    this.institucion = institucion;
  }
}
