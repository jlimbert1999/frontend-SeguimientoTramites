import { typeProcedure } from "src/app/administration/interfaces/typeProcedure.interface";

export interface external {
    _id: string;
    tipo_tramite: typeProcedure;
    cuenta: string;
    estado: string;
    alterno: string;
    pin: number;
    detalle: string;
    cantidad: string;
    fecha_registro: string;
    cite: string;
    observaciones: any[];
    solicitante: applicant;
    representante?: representative;
    enviado: boolean;
}

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

