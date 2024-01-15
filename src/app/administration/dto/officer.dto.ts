interface officer {
  nombre: string;
  paterno: string;
  materno: string;
  dni: string;
  telefono: string;
  direccion: string;
  cargo?: string;
  cuenta: boolean;
}
export class OfficerDto {
  static FormtoModel(form: any) {
    return new OfficerDto({
      nombre: form['nombre'],
      materno: form['materno'],
      paterno: form['paterno'],
      dni: form['dni'],
      telefono: form['telefono'],
      direccion: form['direccion'],
      cargo: form['cargo'],
      cuenta: form['cuenta'],
    });
  }
  nombre: string;
  materno: string;
  paterno: string;
  dni: string;
  telefono: string;
  direccion: string;
  cargo?: string;
  cuenta: boolean;
  constructor({ nombre, materno, paterno, dni, telefono, direccion, cargo, cuenta }: officer) {
    this.nombre = nombre;
    this.materno = materno;
    this.paterno = paterno;
    this.dni = dni;
    this.telefono = telefono;
    this.direccion = direccion;
    this.cargo = cargo;
    this.cuenta = cuenta;
  }
}
