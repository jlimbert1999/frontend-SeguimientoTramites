import { Funcionario } from "./funcionario.interface"

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
    rol: string[]
    funcionario?: Funcionario,
    dependencia: {
        nombre: string, institucion: { sigla: string }
    }
    activo: boolean
}
