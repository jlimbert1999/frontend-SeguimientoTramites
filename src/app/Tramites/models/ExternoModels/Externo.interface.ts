import { RepresentanteDto, SolicitanteDto } from "./Externo.dto"

export interface ExternoData1 {
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
    motivo: string
    numero_interno: string
    tipo: string
    tramite: string
    recibido?:boolean
}