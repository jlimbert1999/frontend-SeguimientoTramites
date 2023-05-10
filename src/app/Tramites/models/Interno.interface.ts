export interface Interno {
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
    cuenta: {
        _id: string
        funcionario: {
            nombre: string
            paterno: string
            materno: string
            cargo: string
        }
    }
    ubicacion: string
    detalle: string
    cite: string
    cantidad: string
    fecha_registro: string
    fecha_finalizacion?: string
    estado: string
    enviado: boolean
}