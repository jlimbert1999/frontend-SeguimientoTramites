import { Funcionario } from "./funcionario.interface"

export interface Cuenta {
    _id: string
    login: string
    rol: string[]
    funcionario?: Funcionario,
    dependencia: {
        nombre: string, institucion: { sigla: string }
    }
    activo: boolean
}
export interface CuentaDto {
    dependencia: string
    login: string
    password: string
    rol: string
}

