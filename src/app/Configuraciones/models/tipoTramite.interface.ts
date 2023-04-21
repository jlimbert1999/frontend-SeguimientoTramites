

export interface TipoTramite {
    id_tipoTramite: string
    nombre: string
    segmento: string
    activo: boolean
    tipo: string
    requerimientos: Requerimiento[]
}
export interface Requerimiento {
    _id?: string;
    nombre: string;
    activo: boolean;
}

export interface TypesProceduresGrouped {
    id_tipoTramite: string
    nombre: string
    segmento: string
    requerimientos?: {
        _id: string
        nombre: string
        activo: Boolean
    }
}
