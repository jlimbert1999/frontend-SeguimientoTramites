import { account } from "src/app/administration/interfaces/account.interface";

export interface newWorkflow {
    _id: {
        cuenta: string;
        tipo: string;
        fecha_envio: string;
    };
    sendings: sending[];
}

export interface sending {
    _id: string;
    emisor: participant;
    receptor: participant;
    tramite: string;
    tipo: string;
    motivo: string;
    cantidad: string;
    fecha_envio: string;
    numero_interno: string;
    fecha_recibido?: string;
    recibido: boolean;
}

export interface participant {
    cuenta: account;
    fullname: string;
    jobtitle?: string;
}

