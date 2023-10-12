import { groupArchive } from '../interfaces/archive-group.interface';

export class ArchiveDto {
  constructor(public description: string, public group: groupArchive) {}
}
