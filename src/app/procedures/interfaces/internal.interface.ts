import { procedure } from './procedure.interface';

export interface internal extends procedure {
  details: {
    remitente: worker;
    destinatario: worker;
  };
}

export interface worker {
  nombre: string;
  cargo: string;
}
