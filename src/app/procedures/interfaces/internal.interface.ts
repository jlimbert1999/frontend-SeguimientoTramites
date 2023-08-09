import { typeProcedure } from "src/app/administration/interfaces/typeProcedure.interface";
import { external } from "./external.interface";

export interface internal {
    _id: string;
    tramite: internal | external;
    tipo_tramite: typeProcedure;
    alterno: string;
    estado: string;
    cuenta: string;
    detalle: string;
    cite: string;
    cantidad: string;
    remitente: Worker;
    destinatario: Worker;
    enviado: boolean;
    fecha_registro: string;
}

export interface Worker {
    nombre: string;
    cargo: string;
}

