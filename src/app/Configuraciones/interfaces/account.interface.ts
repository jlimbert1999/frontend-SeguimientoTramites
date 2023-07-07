import { dependency } from "./dependency.interface";
import { officer } from "./oficer.interface";

export interface account {
    _id: string;
    dependencia: dependency;
    login: string;
    rol: string;
    funcionario?: officer;
    activo: boolean;
}
