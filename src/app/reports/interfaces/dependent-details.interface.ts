export interface dependentDetails {
  _id: filter;
  details: Detail[];
  count: number;
}

export interface filter {
  _id: string;
  funcionario?: Funcionario;
}

export interface Funcionario {
  _id: string;
  nombre: string;
  paterno: string;
  materno: string;
  cargo?: Cargo;
}

export interface Cargo {
  _id: string;
  nombre: string;
}

export interface Detail {
  status: string;
  total: number;
}
