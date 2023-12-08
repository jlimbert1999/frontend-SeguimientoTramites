import { PaginationParameters } from 'src/app/shared/interfaces';

export interface searchProcedureParams extends PaginationParameters {
  text: string;
}
