import { procedure } from 'src/app/procedures/interfaces';
import { participant } from './participant.interface';
import { inbox } from './inbox.interface';

export interface groupedOutbox {
  _id: { cuenta: string; tramite: procedure; fecha_envio: string };
  sendings: send[];
}

export interface send extends inbox {
  numero_interno: string;
  fecha_recibido?: string;
}

