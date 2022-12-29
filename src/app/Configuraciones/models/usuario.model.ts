export interface UsuarioModel {
    _id?: string
    nombre: string
    paterno: string
    materno: string
    dni: string
    telefono: number
    direccion: string
    cargo: string
    expedido: string
    activo?: boolean
    cuenta?: boolean
}