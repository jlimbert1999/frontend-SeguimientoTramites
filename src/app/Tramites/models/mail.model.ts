export interface EnvioModel {
    id_tramite: string
    emisor: {
        cuenta: string
        funcionario: string
        cargo: string
    }
    receptor: {
        cuenta: string
        funcionario: string
        cargo: string
    }
    motivo: string
    cantidad: string
    tipo: 'tramites_externos' | 'tramites_internos'
    numero_interno: string
}




export interface UsersMails {
    _id: string
    funcionario: {
        nombre: string,
        paterno: string,
        materno: string,
        cargo: string
    }
    id: string //id socket 
}



export interface BandejaSalidaModel_View {
    emisor: {
        cuenta: string,
        funcionario: string,
        cargo: string
    }
    receptor: {
        cuenta: {
            _id: string,
            dependencia: {
                nombre: string,
                institucion: {
                    sigla: string
                }
            }
        },
        funcionario: string,
        cargo: string
    },
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
    recibido: boolean
}


export interface BandejaEntradaData {
    _id: string
    tramite: {
        _id: string,
        tipo_tramite: {
            nombre: string
        },
        estado: string
        alterno: string
    },
    emisor: {
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
    receptor: string
    motivo: string
    cantidad: string
    fecha_envio: Date
    recibido: boolean
}


export interface MailDetails {
    cantidad: string
    emisor: {
        _id: string
        dependencia: {
            nombre: string,
            institucion: {
                sigla: string
            }
        }
        funcionario: {
            nombre: string
            paterno: string
            materno:string
            cargo: string
        }
    }
    fecha_envio: string
    motivo: string
    recibido: boolean
    tramite: string
    _id: string
}

export interface Observacion {
    corregido: boolean
    descripcion: string
    fecha: string
    funcionario: string
    id_cuenta: string
}
