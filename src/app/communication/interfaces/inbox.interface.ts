import { procedure } from 'src/app/procedures/interfaces/procedure.interface';
import { participant } from './participant.interface';

export interface inbox {
  _id: string;
  emisor: participant;
  receptor: participant;
  tramite: procedure;
  motivo: string;
  cantidad: string;
  fecha_envio: string;
  recibido?: boolean;
}
