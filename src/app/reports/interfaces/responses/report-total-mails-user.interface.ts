export interface TotalMailsUser {
  _id: ID;
  details: Detail[];
  total: number;
}

interface ID {
  _id: string;
  funcionario?: Funcionario;
}

interface Funcionario {
  _id: string;
  nombre: string;
  paterno: string;
  materno: string;
  cargo?: Cargo;
}

interface Cargo {
  _id: string;
  nombre: string;
}

interface Detail {
  status: string;
  count: number;
}
