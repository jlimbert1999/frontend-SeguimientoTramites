export interface Funcionario {
    _id: string
    nombre: string
    paterno: string
    materno: string
    dni: string
    telefono: number
    direccion: string
    cargo: string
    activo: boolean
    cuenta: boolean
    superior: string
}
export interface FuncionarioDto {
    nombre: string
    paterno: string
    materno: string
    dni: string
    telefono: number
    direccion: string
    cargo: string
}