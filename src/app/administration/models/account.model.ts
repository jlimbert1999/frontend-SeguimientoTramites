import { account } from '../interfaces';
import { Officer } from './officer.model';

interface AccountProps {
  login: string;
  rol: string;
  activo: boolean;
  funcionario?: Officer;
}

export class Account {
  login: string;
  rol: string;
  activo: boolean;
  funcionario?: Officer;
  static fromJson(account: account) {
    const { funcionario, ...values } = account;
    return new Account({
      ...values,
      ...(funcionario && { funcionario: Officer.officerFromJson(funcionario) }),
    });
  }
  constructor({ login, rol, activo, funcionario }: AccountProps) {
    this.funcionario = funcionario;
    this.activo = activo;
    this.login = login;
    this.rol = rol;
  }
}
