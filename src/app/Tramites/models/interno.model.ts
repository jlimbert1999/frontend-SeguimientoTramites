export interface TipoTramiteInternoModel {
    id_tipoTramite: string
    nombre: string
    segmento: string
}

export interface TramiteInternoModel {
    tipo_tramite: string
    detalle: string
    cite: string
    cantidad: string
    remitente: {
        nombre: string
        cargo: string
    },
    destinatario: {
        nombre: string
        cargo: string
    }
}

export interface InternoData {
    _id: string
    remitente: {
        nombre: string
        cargo: string
    },
    destinatario: {
        nombre: string
        cargo: string
    }
    tipo_tramite: { nombre: string }
    alterno: string
    cuenta: string
    ubicacion: { _id: string },
    detalle: string
    cite: string
    cantidad: string
    fecha_registro: Date
    estado: string
}