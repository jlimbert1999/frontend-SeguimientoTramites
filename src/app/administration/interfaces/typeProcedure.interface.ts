export interface typeProcedure {
    _id: string;
    nombre: string;
    segmento: string;
    requerimientos: requirement[];
    tipo: groupTypeProcedure;
    activo: boolean;
}
export interface requirement {
    nombre: string
    activo: boolean
}
export type groupTypeProcedure = 'INTERNO' | 'EXTERNO'