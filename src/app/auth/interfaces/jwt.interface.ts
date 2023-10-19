export interface jwtPayload {
  id_account: string;
  id_dependency: string;
  officer: {
    fullname: string;
    jobtitle?: string;
  };
}
