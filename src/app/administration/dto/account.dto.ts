import { OfficerDto } from './officer.dto';

interface AccountProps {
  login: string;
  password: string;
  dependencia: string;
  rol: string;
}
export class AccountDto {
  static FormtoModel(fomAccount: any) {
    const accountDto = {
      login: fomAccount['login'],
      dependencia: fomAccount['dependencia'],
      rol: fomAccount['rol'],
      password: fomAccount['password'],
    };
    return new AccountDto(accountDto);
  }
  constructor(public account: AccountProps) {}
}
