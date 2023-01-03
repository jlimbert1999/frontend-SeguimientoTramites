import { TiposTramitesModel } from "src/app/Configuraciones/models/tiposTramites.model"
import { RepresentanteModel, SolicitanteModel } from "./solicitud.model"

export interface ExternoModel {
    alterno: string
    tipo_tramite: string
    detalle: string
    cantidad: string
    ubicacion: string
    cite: string
}


export interface InfoExterno {
    _id: string
    alterno: string
    cantidad: string
    cuenta: string
    detalle: string
    estado: string
    fecha_registro: string
    pin: number
    requerimientos: string[]
    observaciones: {
        id_cuenta: string
        funcionario: string
        descripcion:string
        fecha: string
        corregido: Boolean
    }[]
    solicitante: SolicitanteModel
    representante?: RepresentanteModel
    cite:string
    ubicacion: {
        id_cuenta:string
        dependencia: {
            nombre: string,
            institucion: {
                sigla: string
            }
        }
        funcionario: {
            nombre: string,
            cargo: string
        }
    }
    tipo_tramite: {
        nombre: string
    }

}