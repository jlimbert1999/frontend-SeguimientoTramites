import { groupProcedure } from 'src/app/procedures/interfaces';

export interface totalReportParams {
  id_institution: string;
  collection: 'procedures' | 'communications';
  group: groupProcedure;
  participant?: 'emitter' | 'receiver';
}
