export interface Externo {
    cantidad: string
    detalle: string
    tipo_tramite: string
    alterno: string
    requerimientos: string[]
    cite: string
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
    telefono: string
    tipo: string
    dni: string
    expedido: string
    documento: string
}

export interface ExternoData {
    _id: string
    alterno: string
    cantidad: string
    cuenta: string
    detalle: string
    estado: string
    fecha_registro: string
    pin: number
    requerimientos: string[]
    solicitante: Solicitante
    representante?: Representante
    ubicacion: {
        _id: string,
        dependencia: {
            nombre: string
            sigla: string
            institucion: {
                sigla: string
            }
        },
        funcionario: {
            nombre: string
            paterno: string
            materno: string
            cargo: string
        }
    }
    tipo_tramite: {
        nombre: string
    }
}

