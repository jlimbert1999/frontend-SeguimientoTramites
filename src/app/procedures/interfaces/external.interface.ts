import { groupProcedure, procedure } from './';

export type typeApplicant = 'NATURAL' | 'JURIDICO';

export interface external extends procedure {
  group: groupProcedure.EXTERNAL;
  details: externalDetails;
}

export interface externalDetails {
  solicitante: applicant;
  representante?: representative;
  requirements: string[];
  pin: number;
}

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
