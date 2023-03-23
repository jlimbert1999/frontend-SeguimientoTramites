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
    recibido?: boolean

}