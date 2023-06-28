import { job } from "./job.interface";

export interface officer {
    _id: string;
    nombre: string;
    paterno: string;
    materno: string;
    dni: number;
    telefono: number;
    direccion: string;
    activo: boolean;
    cuenta: boolean;
    cargo?: job;
}