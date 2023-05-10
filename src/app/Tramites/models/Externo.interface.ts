export interface Externo {
    _id: string
    alterno: string
    cantidad: string
    cuenta: {
        _id: string
        funcionario: {
            nombre: string
            paterno: string
            materno: string
            cargo: string
        }
    }
    detalle: string
    estado: string
    fecha_registro: string
    fecha_finalizacion?: string
    pin: number
    requerimientos: string[]
    solicitante: Solicitante
    representante?: Representante
    cite: string
    tipo_tramite: {
        nombre: string
    },
    eventos?: any[]
    enviado:boolean
}

export interface Solicitante {
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
    nombre: string
    paterno: string
    materno: string
    telefono: string
    tipo: string
    dni: string
    expedido: string
    documento: string
}
export interface Observacion {
    _id: string
    procedure: string
    group: "tramites_externos" | "tramites_internos",
    officer: {
        nombre: string
        paterno: string
        materno: string
        cargo: string
    }
    account: string
    description: string
    solved: boolean
    date: Date
}
