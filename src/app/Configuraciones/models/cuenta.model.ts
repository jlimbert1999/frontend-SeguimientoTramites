import { UsuarioModel } from "./usuario.model"

export interface CuentaModel {
    _id?: string
    dependencia: string
    login: string
    password: string
    rol: string
}

export interface CuentaData {
    _id: string
    login: string
    rol: string
    funcionario?: UsuarioModel,
    dependencia: {
        nombre: string, institucion: { sigla: string }
    }
    activo: boolean
}
