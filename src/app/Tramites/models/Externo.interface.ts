import { RepresentanteDto, SolicitanteDto } from "./Externo.dto"
export interface TypeTramiteData {
    id_tipoTramite: string
    nombre: string
    segmento: string
    requerimientos: {
        nombre: string
    }[]
}

export interface Externo {
    _id: string
    alterno: string
    cantidad: string
    cuenta: string
    detalle: string
    estado: string
    fecha_registro: string
    fecha_finalizacion?: string
    pin: number
    requerimientos: string[]
    solicitante: SolicitanteDto
    representante?: RepresentanteDto
    cite: string
    observaciones:any[]
    tipo_tramite: {
        nombre: string
    },
    eventos?:any[]
}

export interface Solicitante {
    _id?: string
    nombre: string
    paterno: string
    materno: string
    telefono: string
    tipo: 'NATURAL' | 'JURIDICO'
    dni: string
    expedido: string
    documento: string
}
export interface Representante {
    _id?: string
    nombre: string
    paterno: string
    materno: string
    telefono: string
    tipo: string
    dni: string
    expedido: string
    documento: string
}
