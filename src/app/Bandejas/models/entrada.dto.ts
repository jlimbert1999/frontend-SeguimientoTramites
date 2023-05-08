import { AccountForSend } from "./entrada.interface";

export interface EntradaDto {
    tramite: string;
    cantidad: string;
    motivo: string;
    tipo: 'tramites_externos' | 'tramites_internos';
    numero_interno: string;
    receptores: AccountForSend[];
}