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
export interface ListWorkflow {
    officer: {
        fullname: string,
        jobtitle: string
    }
    shippigDate: string
    adjunt: string
    duration: string
    workUnit: string
    workInstitution: string
    reference: string
    sends: {
        officer: {
            fullname: string,
            jobtitle: string
        }
        received: boolean | undefined
        receivedDate?: string
        duration: string,
        workUnit: string
        workInstitution: string
    }[]
}
export interface LocationProcedure {
    cuenta: {
        dependencia: {
            nombre: string
        },
        funcionario: {
            nombre: string
            paterno: string
            materno: string
            cargo: string
        }
    }
}