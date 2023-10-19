import { stateProcedure } from 'src/app/procedures/interfaces';

export class EventProcedureDto {
  constructor(
    public procedure: string,
    public description: string,
    public stateProcedure: stateProcedure
  ) {}
}
