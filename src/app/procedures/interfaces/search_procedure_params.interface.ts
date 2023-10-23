import { paginationParams } from 'src/app/shared/interfaces/pagination_params.interface';

export interface searchProcedureParams extends paginationParams {
  text: string;
}
