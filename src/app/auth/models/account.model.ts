export interface jwtPayload {
  id_account: string;
  id_dependencie: string;
  officer: {
    fullname: string;
    jobtitle?: string;
  };
}
export interface userSocket {
  id_account: string;
  id_dependencie: string;
  officer: {
    fullname: string;
    jobtitle: string;
  };
  socketIds: string[];
}
