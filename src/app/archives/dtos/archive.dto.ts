import { groupArchive } from '../interfaces/archive-group.interface';

export class ArchiveDto {
  constructor(
    public procedure: string,
    public description: string,
    public group: groupArchive
  ) {}
}
