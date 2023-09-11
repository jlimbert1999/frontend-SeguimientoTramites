import { account } from "src/app/administration/interfaces";

export interface participant {
  cuenta: account;
  fullname: string;
  jobtitle?: string;
}
