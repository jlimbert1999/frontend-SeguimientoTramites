interface AccountProps {
  login: string;
  password: string;
  dependencia: string;
  rol: string;
}
export class AccountDto {
  login: string;
  password: string;
  dependencia: string;
  rol: string;
  static FormtoModel(fomAccount: any) {
    const accountDto = {
      login: fomAccount['login'],
      dependencia: fomAccount['dependencia'],
      rol: fomAccount['rol'],
      password: fomAccount['password'],
    };
    return new AccountDto(accountDto);
  }
  constructor({ login, password, dependencia, rol }: AccountProps) {
    this.login = login;
    this.password = password;
    this.dependencia = dependencia;
    this.rol = rol;
  }
}
