export interface TipoTramite_Registro {
    id_tipoTramite: string
    nombre: string
    segmento: string
    requerimientos: {
        nombre: string
    }[]
}