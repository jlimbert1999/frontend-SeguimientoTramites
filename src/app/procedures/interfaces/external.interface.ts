import { groupProcedure, procedure } from './procedure.interface';
export type typeApplicant = 'NATURAL' | 'JURIDICO';
export interface applicant {
  nombre: string;
  telefono: string;
  tipo: typeApplicant;
  paterno?: string;
  materno?: string;
  documento?: string;
  dni?: string;
}

export interface representative {
  nombre: string;
  telefono: string;
  paterno: string;
  materno: string;
  documento: string;
  dni: string;
}
export interface detailsExternal {
  solicitante: applicant;
  representante?: representative;
  requirements: string[];
  pin: number;
}

export interface external extends procedure {
  group: groupProcedure.EXTERNAL;
  details: detailsExternal;
}
