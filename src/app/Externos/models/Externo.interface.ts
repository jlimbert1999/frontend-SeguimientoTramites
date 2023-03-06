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


export interface WorkflowData {
    cantidad: string
    duracion?: string
    emisor: {
        cuenta: {
            _id: string,
            dependencia: {
                nombre: string,
                institucion: {
                    sigla: string
                }
            }

        }
        funcionario: {
            nombre: string
            paterno: string
            materno: string
            cargo: string
        }
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
        }
        funcionario: {
            nombre: string
            paterno: string
            materno: string
            cargo: string
        }
    }
    fecha_envio: string
    fecha_recibido?: string
    motivo: string
    numero_interno: string
    tipo: string
    tramite: string
    recibido?:boolean
}