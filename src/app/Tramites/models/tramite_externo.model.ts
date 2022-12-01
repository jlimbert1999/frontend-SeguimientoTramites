import { TiposTramitesModel } from "src/app/Configuraciones/models/tiposTramites.model"
import { SolicitanteModel } from "./solicitud.model"

export interface ExternoModel {
    alterno: string
    tipo_tramite: string
    detalle: string
    cantidad: string
    ubicacion: string
}
export interface ExternoModel_View {
    _id: string
    alterno: string
    cantidad: string
    cuenta: string
    detalle: string
    estado: string
    fecha_registro: Date
    pin: number
    requerimientos: string[]
    solicitante: SolicitanteModel
    ubicacion: {
        dependencia: {
            nombre: string,
            institucion: {
                sigla: string
            }
        }
    }
    tipo_tramite: {
        nombre: string
    }
}