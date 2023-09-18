import { communication } from './communication';

export interface workflow {
  _id: {
    cuenta: string;
    fecha_envio: string;
  };
  sendings: communication[];
}
