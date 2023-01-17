export interface TypeTramiteData {
    id_tipoTramite: string
    nombre: string
    segmento: string
    requerimientos: {
        nombre: string
    }[]
}