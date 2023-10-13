import { stateProcedure } from 'src/app/procedures/interfaces';

export class ArchiveDto {
  constructor(
    public procedure: string,
    public description: string,
    public state: stateProcedure
  ) {}
}
