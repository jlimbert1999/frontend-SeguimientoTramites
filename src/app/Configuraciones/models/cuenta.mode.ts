import { UsuarioModel } from "./usuario.model"

export interface CuentaModel {
    _id?: string
    dependencia: string
    login: string
    password: string
    rol: string
}

export interface CuentaModel_view {
    id_cuenta: string
    login: string
    rol: string
    funcionario: UsuarioModel,
    dependencia: {
        nombre: string, institucion: { sigla: string }
    }
}
