import { account } from "src/app/auth/models/account.model";
import { external } from "src/app/procedures/interfaces/external.interface";
import { internal } from "src/app/procedures/interfaces/internal.interface";

export interface inbox {
    _id: string;
    emisor: participant;
    receptor: participant;
    tramite: internal | external;
    tipo: string;
    motivo: string;
    cantidad: string;
    fecha_envio: string;
}

export interface participant {
    cuenta: account;
    fullname: string;
    jobtitle: string;
}

