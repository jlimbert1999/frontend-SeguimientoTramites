export interface BandejaEntradaModel {
    tipo: 'tramites_internos' | 'tramites_externos'
    cuenta_receptor: string
    tramite: string
    motivo: string
}

export interface BandejaSalidaModel {
    tipo: 'tramites_internos' | 'tramites_externos'
    funcionario_receptor: {
        funcionario: string
        cargo: string
    }
    funcionario_emisor: {
        funcionario: string
        cargo: string
    }
    cuenta_receptor: string
    tramite: string
    motivo: string,
    motivo_rechazo?: string
}

export interface UsersMails {
    dependencia: {
        nombre: string
    }
    funcionario: {
        _id: string,
        nombre: string,
        cargo: string
    }
    id_cuenta: string
    id: string //id socket 
}



export interface BandejaSalidaModel_View {
    cuenta_emisor: string
    cuenta_receptor: {
        _id: string,
        dependencia: {
            nombre: string,
            institucion: {
                sigla: string
            }
        }
    },
    funcionario_receptor: {
        funcionario: {
            _id: string,
            nombre: string
        }
        cargo: string
    }

    tramite: {
        _id: string,
        tipo_tramite: {
            nombre: string
        },
        estado: string
        alterno: string
    },
    tipo: 'tramites_externos' | 'tramites_internos',
    motivo: string
    fecha_envio: Date
    recibido?: boolean,
    reenviado: boolean
}


export interface BandejaEntradaModel_View {
    _id: string
    tramite: {
        _id: string,
        tipo_tramite: {
            nombre: string
        },
        estado: string
        alterno: string
    },
    cuenta_emisor: {
        _id: string,
        dependencia: {
            nombre: string,
            institucion: {
                sigla: string
            }
        },
        funcionario: {
            _id: string,
            nombre: string,
            cargo: string
        }
    },
    tipo: 'tramites_externos' | 'tramites_internos',
    cuenta_receptor: string
    motivo: string
    fecha_envio: Date
    recibido: boolean
}

