export interface Dependencia {
    id_dependencia: string
    institucion: { _id: string, sigla: string },
    nombre: string,
    sigla: string,
    codigo: string
    activo: boolean
}
